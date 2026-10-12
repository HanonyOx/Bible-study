import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  error: string | null
  profileStatus: 'idle' | 'loading' | 'ready' | 'error'
  profileError: string | null
  retryProfile: () => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
