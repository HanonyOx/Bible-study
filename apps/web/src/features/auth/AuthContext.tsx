import { useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { AuthContext } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileRetry, setProfileRetry] = useState(0)
  const [profileResult, setProfileResult] = useState<{
    userId: string
    attempt: number
    error: string | null
  } | null>(null)
  const userId = user?.id
  const currentProfileResult =
    profileResult &&
    profileResult.userId === userId &&
    profileResult.attempt === profileRetry
      ? profileResult
      : null
  const profileStatus = !userId
    ? 'idle'
    : currentProfileResult
      ? currentProfileResult.error
        ? 'error'
        : 'ready'
      : 'loading'
  const profileError =
    profileStatus === 'error' ? currentProfileResult?.error ?? null : null

  useEffect(() => {
    let active = true
    let authEventReceived = false
    let unsubscribe: (() => void) | undefined

    void Promise.resolve()
      .then(async () => {
        if (!active) return null
        const { getSupabaseClient } = await import(
          '../../services/supabaseClient'
        )
        if (!active) return null
        const client = getSupabaseClient()
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
          authEventReceived = true
          if (active) {
            setUser(session?.user ?? null)
            setLoading(false)
            setError(null)
          }
        })
        unsubscribe = () => subscription.unsubscribe()
        return client.auth.getSession()
      })
      .then((result) => {
        if (!active || !result) return
        const { data, error: sessionError } = result
        if (sessionError && !authEventReceived) {
          setError(sessionError.message)
        } else if (!authEventReceived) {
          setUser(data.session?.user ?? null)
        }
        setLoading(false)
      })
      .catch((clientError: unknown) => {
        if (!active) return
        setError(
          clientError instanceof Error
            ? clientError.message
            : 'Unable to check your sign-in status. Please refresh and try again.',
        )
        setLoading(false)
      })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    let active = true

    void Promise.resolve()
      .then(async () => {
        const { getSupabaseClient } = await import(
          '../../services/supabaseClient'
        )
        return getSupabaseClient().rpc('ensure_my_profile')
      })
      .then(({ error: profileCreationError }) => {
        if (profileCreationError) throw profileCreationError
        if (active) {
          setProfileResult({ userId, attempt: profileRetry, error: null })
        }
      })
      .catch((profileCreationError: unknown) => {
        if (!active) return
        setProfileResult({
          userId,
          attempt: profileRetry,
          error:
            profileCreationError instanceof Error
              ? profileCreationError.message
              : 'An unexpected error occurred while setting up your profile.',
        })
      })

    return () => {
      active = false
    }
  }, [userId, profileRetry])

  function retryProfile() {
    setProfileRetry((attempt) => attempt + 1)
  }

  async function signOut() {
    try {
      const { getSupabaseClient } = await import(
        '../../services/supabaseClient'
      )
      const client = getSupabaseClient()
      const { error: signOutError } = await client.auth.signOut()
      if (signOutError) throw signOutError
      setUser(null)
      setError(null)
    } catch (signOutError) {
      const message =
        signOutError instanceof Error
          ? signOutError.message
          : 'Unable to sign out. Please try again.'
      setError(message)
      throw signOutError
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        profileStatus,
        profileError,
        retryProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
