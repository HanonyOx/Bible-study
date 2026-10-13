import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import type { SundaySchoolLesson } from './sundaySchoolData'
import { readStudentVisibleLessons } from './sundaySchoolRepository'

const useDatabaseReads =
  import.meta.env.VITE_SUNDAY_SCHOOL_DATABASE_READS === 'true'
const useDemonstrationData =
  !useDatabaseReads &&
  import.meta.env.VITE_SUNDAY_SCHOOL_DEMO_MODE === 'true'

export function useStudentLessons() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState<SundaySchoolLesson[]>([])
  const [source, setSource] = useState<'local' | 'database' | 'demo'>(
    useDemonstrationData ? 'demo' : 'local',
  )
  const [loading, setLoading] = useState(
    useDatabaseReads || useDemonstrationData,
  )
  const [warning, setWarning] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true

    if (useDemonstrationData) {
      void import('./demoLessonData')
        .then(({ getLocalDemonstrationLessons }) => {
          if (!active) return
          setLessons(getLocalDemonstrationLessons())
          setSource('demo')
          setWarning(null)
        })
        .catch((error: unknown) => {
          if (!active) return
          setLessons([])
          setWarning(
            `Demonstration lessons could not be loaded: ${
              error instanceof Error ? error.message : 'Please retry.'
            }`,
          )
        })
        .finally(() => {
          if (active) setLoading(false)
        })

      return () => {
        active = false
      }
    }

    if (!useDatabaseReads) return

    const loadLessons = user
      ? readStudentVisibleLessons()
      : Promise.resolve([])

    void loadLessons
      .then((databaseLessons) => {
        if (!active) return
        setLessons(databaseLessons)
        if (user && databaseLessons.length > 0) {
          setSource('database')
          setWarning(null)
        } else {
          setSource('local')
          setWarning(
            user
              ? 'No student-published database lessons are available.'
              : null,
          )
        }
      })
      .catch((error: unknown) => {
        if (!active) return
        setLessons([])
        setSource('local')
        setWarning(
          `Database lessons could not be loaded. No local draft content was used. ${
            error instanceof Error ? error.message : 'Please retry.'
          }`,
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [retry, user])

  return {
    lessons,
    loading,
    source,
    warning,
    retry: () => {
      setLoading(true)
      setRetry((value) => value + 1)
    },
  }
}
