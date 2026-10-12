import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !publishableKey) {
    const missingVariables = [
      !url && 'VITE_SUPABASE_URL',
      !publishableKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
    ].filter(Boolean)

    throw new Error(
      `Supabase is not configured. Set ${missingVariables.join(' and ')} in apps/web/.env.local (copy apps/web/.env.example), then restart the Vite dev server.`,
    )
  }

  supabaseClient = createClient(url, publishableKey)
  return supabaseClient
}
