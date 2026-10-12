import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  getStudentVisibleLessons,
} from './sundaySchoolData'
import { readStudentVisibleLessons } from './sundaySchoolRepository'

const useDatabaseReads =
  import.meta.env.VITE_SUNDAY_SCHOOL_DATABASE_READS === 'true'

export function useStudentLessons() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState(getStudentVisibleLessons)
  const [source, setSource] = useState<'local' | 'database'>('local')
  const [loading, setLoading] = useState(useDatabaseReads)
  const [warning, setWarning] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    if (!useDatabaseReads) return

    const loadLessons = user
      ? readStudentVisibleLessons()
      : Promise.resolve(getStudentVisibleLessons())

    void loadLessons
      .then((databaseLessons) => {
        if (!active) return
        if (!user) {
          setLessons(databaseLessons)
          setSource('local')
          setWarning(null)
          return
        }
        if (databaseLessons.length === 0) {
          setLessons(getStudentVisibleLessons())
          setSource('local')
          setWarning(
            'No student-published database lessons were returned; showing locally published content.',
          )
        } else {
          setLessons(databaseLessons)
          setSource('database')
          setWarning(null)
        }
      })
      .catch((error: unknown) => {
        if (!active) return
        setLessons(getStudentVisibleLessons())
        setSource('local')
        setWarning(
          `Database lessons could not be loaded; showing locally published content. ${
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
