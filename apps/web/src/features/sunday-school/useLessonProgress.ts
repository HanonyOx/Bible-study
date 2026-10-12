import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { getSupabaseClient } from '../../services/supabaseClient'
import type { SundaySchoolLesson } from './sundaySchoolData'

type ProgressStatus = 'started' | 'completed'
type LessonProgress = {
  status: ProgressStatus
  updatedAt: string
}
type ProgressByLesson = Record<string, LessonProgress>

const useDatabaseReads =
  import.meta.env.VITE_SUNDAY_SCHOOL_DATABASE_READS === 'true'

function progressStorageKey(userId: string) {
  return `word-way:lesson-progress:${userId}`
}

function readLocalProgress(userId: string): ProgressByLesson {
  const storedValue = window.localStorage.getItem(progressStorageKey(userId))
  if (!storedValue) return {}

  const parsed: unknown = JSON.parse(storedValue)
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Saved lesson progress has an unexpected format.')
  }

  const progress: ProgressByLesson = {}
  for (const [lessonId, value] of Object.entries(parsed)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      'status' in value &&
      (value.status === 'started' || value.status === 'completed') &&
      'updatedAt' in value &&
      typeof value.updatedAt === 'string'
    ) {
      progress[lessonId] = {
        status: value.status,
        updatedAt: value.updatedAt,
      }
    }
  }
  return progress
}

function writeLocalProgress(userId: string, progress: ProgressByLesson) {
  window.localStorage.setItem(
    progressStorageKey(userId),
    JSON.stringify(progress),
  )
}

export function useLessonProgress(
  lessons: SundaySchoolLesson[],
  databaseBacked: boolean,
) {
  const { user } = useAuth()
  const [savedProgress, setSavedProgress] = useState<{
    userId: string | null
    values: ProgressByLesson
  }>({ userId: null, values: {} })
  const [warning, setWarning] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const progress = useMemo(
    () => (user && savedProgress.userId === user.id ? savedProgress.values : {}),
    [savedProgress, user],
  )
  const lessonIds = useMemo(
    () => new Set(lessons.map(({ id }) => id)),
    [lessons],
  )

  useEffect(() => {
    let active = true
    if (!user) {
      return
    }

    void Promise.resolve().then(() => {
      if (!active) return
      try {
        setSavedProgress({ userId: user.id, values: readLocalProgress(user.id) })
      } catch (error) {
        setWarning(
          error instanceof Error
            ? `Local lesson progress could not be read: ${error.message}`
            : 'Local lesson progress could not be read.',
        )
      }
    })

    if (useDatabaseReads && databaseBacked) {
      void Promise.resolve(
        getSupabaseClient()
          .from('lesson_progress')
          .select('lesson_id, status, updated_at'),
      )
        .then(({ data, error }) => {
          if (!active) return
          if (error) {
            setWarning(`Database progress could not be loaded: ${error.message}`)
            return
          }
          const databaseProgress: ProgressByLesson = {}
          for (const row of data ?? []) {
            if (
              lessonIds.has(row.lesson_id) &&
              (row.status === 'started' || row.status === 'completed') &&
              typeof row.updated_at === 'string'
            ) {
              databaseProgress[row.lesson_id] = {
                status: row.status,
                updatedAt: row.updated_at,
              }
            }
          }
          setSavedProgress((localProgress) => {
            const values =
              localProgress.userId === user.id
                ? { ...localProgress.values }
                : {}
            for (const [lessonId, dbEntry] of Object.entries(databaseProgress)) {
              if (
                !values[lessonId] ||
                values[lessonId].updatedAt <= dbEntry.updatedAt
              ) {
                values[lessonId] = dbEntry
              }
            }
            return { userId: user.id, values }
          })
          setWarning(null)
        })
        .catch((error: unknown) => {
          if (!active) return
          setWarning(
            `Database progress could not be loaded: ${
              error instanceof Error ? error.message : 'Please retry.'
            }`,
          )
        })
    }

    return () => {
      active = false
    }
  }, [databaseBacked, lessonIds, retryCount, user])

  const recordProgress = useCallback(
    async (lessonId: string, status: ProgressStatus) => {
      if (!user || !lessonIds.has(lessonId)) return
      const entry = { status, updatedAt: new Date().toISOString() }
      const updatedProgress = { ...progress, [lessonId]: entry }
      setSavedProgress({ userId: user.id, values: updatedProgress })

      try {
        writeLocalProgress(user.id, updatedProgress)
        setWarning(null)
      } catch (error) {
        setWarning(
          error instanceof Error
            ? `Local lesson progress could not be saved: ${error.message}`
            : 'Local lesson progress could not be saved.',
        )
      }

      if (!useDatabaseReads || !databaseBacked) return

      try {
        const { error } = await getSupabaseClient()
          .from('lesson_progress')
          .upsert(
            { user_id: user.id, lesson_id: lessonId, status },
            { onConflict: 'user_id,lesson_id' },
          )
        if (error) {
          setWarning(
            `Database progress was not saved; this update remains on this device. ${error.message}`,
          )
        }
      } catch (error) {
        setWarning(
          `Database progress was not saved; this update remains on this device. ${
            error instanceof Error ? error.message : 'Please retry.'
          }`,
        )
      }
    },
    [databaseBacked, lessonIds, progress, user],
  )

  const startLesson = useCallback(
    (lessonId: string) => recordProgress(lessonId, 'started'),
    [recordProgress],
  )
  const completeLesson = useCallback(
    (lessonId: string) => recordProgress(lessonId, 'completed'),
    [recordProgress],
  )

  return {
    progress,
    warning,
    startLesson,
    completeLesson,
    retry: () => setRetryCount((count) => count + 1),
  }
}
