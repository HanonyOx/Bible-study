import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSupabaseClient } from '../../services/supabaseClient'
import {
getAgeGroupForDateOfBirth,
getLocalDateInputValue,
} from './ageGroups.mjs'
import type { AgeGroup } from './ageGroups.mjs'
import { useAuth } from './useAuth'

function isAgeGroup(value: unknown): value is AgeGroup {
return value === 'children' || value === 'teens' || value === 'adults'
}

const inputClass =
'mt-2 block w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green'

const buttonClass =
'inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:cursor-not-allowed disabled:opacity-60'

const secondaryButtonClass =
'inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-[#f5f3ed] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay'

function EditProfilePage() {
const { user } = useAuth()
const navigate = useNavigate()

const [displayName, setDisplayName] = useState('')
const [dateOfBirth, setDateOfBirth] = useState('')
const [loading, setLoading] = useState(true)
const [busy, setBusy] = useState(false)
const [error, setError] = useState<string | null>(null)
const [message, setMessage] = useState<string | null>(null)

useEffect(() => {
let cancelled = false
async function loadProfile() {
  if (!user) {
    setLoading(false)
    setError('Sign in to edit your profile.')
    return
  }

  setLoading(true)
  setError(null)

  try {
    const client = getSupabaseClient()

    const { error: ensureError } =
      await client.rpc('ensure_my_profile')

    if (ensureError) throw ensureError

    const { data, error: profileError } = await client
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    if (
      data.display_name !== null &&
      typeof data.display_name !== 'string'
    ) {
      throw new Error('Your profile contains an invalid display name.')
    }

    if (!cancelled) {
      setDisplayName(data.display_name ?? '')
    }
  } catch (loadError) {
    if (!cancelled) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Your profile could not be loaded. Please try again.',
      )
    }
  } finally {
    if (!cancelled) setLoading(false)
  }
}

void loadProfile()

return () => {
  cancelled = true
}}, [user?.id])

const calculatedAgeGroup = dateOfBirth
? getAgeGroupForDateOfBirth(dateOfBirth)
: null

const storedAgeGroup = isAgeGroup(user?.user_metadata.age_group)
? user.user_metadata.age_group
: null

const ageGroup = calculatedAgeGroup ?? storedAgeGroup

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault()
setError(null)
setMessage(null)

if (!user) {
  setError('Sign in again to update your profile.')
  return
}

if (!displayName.trim()) {
  setError('Enter a display name.')
  return
}

if (displayName.trim().length > 80) {
  setError('Your display name must be 80 characters or fewer.')
  return
}

if (!dateOfBirth) {
  setError('Enter your date of birth to calculate your age group.')
  return
}

if (dateOfBirth > getLocalDateInputValue()) {
  setError('Your date of birth cannot be in the future.')
  return
}

if (!calculatedAgeGroup) {
  setError('Enter a valid date of birth for someone at least 1 year old.')
  return
}

if (
  calculatedAgeGroup === 'children' &&
  storedAgeGroup !== 'children'
) {
  setError(
    'Changing an account to the Children age group requires a guardian-managed account process, which is not available yet.',
  )
  return
}

setBusy(true)

try {
  const client = getSupabaseClient()

  const { error: nameUpdateError } = await client
    .from('profiles')
    .update({ display_name: displayName.trim() })
    .eq('id', user.id)

  if (nameUpdateError) throw nameUpdateError

  const { error: ageUpdateError } = await client.auth.updateUser({
    data: { age_group: calculatedAgeGroup },
  })

  if (ageUpdateError) {
    throw new Error(
      `Your display name was saved, but your age group could not be updated: ${ageUpdateError.message}`,
    )
  }

  setMessage('Your profile has been updated.')

  window.setTimeout(() => {
    navigate('/profile')
  }, 800)
} catch (saveError) {
  setError(
    saveError instanceof Error
      ? saveError.message
      : 'Your profile could not be saved. Please try again.',
  )
} finally {
  setBusy(false)
}


}

return ( 
<section className="mx-auto w-[min(100%-40px,760px)] py-10 max-[520px]:py-7"> <div className="rounded-xl border border-border bg-surface p-8 shadow-[0_8px_24px_rgba(41,52,46,0.05)] max-[520px]:p-5"> <p className="mb-2 text-[11px] font-bold uppercase tracking-[1.3px] text-clay">
Account settings </p>
    <h1 className="mb-2 font-serif text-3xl font-medium text-ink">
      Edit your profile
    </h1>

    <p className="mb-6 text-sm leading-6 text-muted">
      Update your display name and age group. Your account email cannot be
      changed here.
    </p>

    {loading ? (
      <p className="text-sm text-muted" role="status">
        Loading your profile…
      </p>
    ) : (
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="edit-profile-email"
        >
          Account email
          <input
            className={`${inputClass} bg-[#f5f3ed]`}
            id="edit-profile-email"
            readOnly
            value={user?.email ?? ''}
          />
        </label>

        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="edit-profile-display-name"
        >
          Display name
          <input
            autoComplete="name"
            className={inputClass}
            id="edit-profile-display-name"
            maxLength={80}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            value={displayName}
          />
        </label>

        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="edit-profile-date-of-birth"
        >
          Date of birth
          <input
            autoComplete="bday"
            className={inputClass}
            id="edit-profile-date-of-birth"
            max={getLocalDateInputValue()}
            onChange={(event) => setDateOfBirth(event.target.value)}
            required
            type="date"
            value={dateOfBirth}
          />
        </label>

        <div
          className="rounded-md bg-[#f5f3ed] px-4 py-3 text-sm text-ink"
          aria-live="polite"
        >
          <span className="font-semibold">Calculated age group: </span>
          {ageGroup === 'children'
            ? 'Children (1–12)'
            : ageGroup === 'teens'
              ? 'Teenagers (13–19)'
              : ageGroup === 'adults'
                ? 'Adults (20+)'
                : 'Enter a valid date of birth.'}
        </div>

        <p className="text-xs leading-5 text-muted">
          Your date of birth is used to calculate your age group but is
          not stored. Your age group is saved as editable account metadata
          and must not be used to grant privileged access. A
          guardian-managed process is required for children’s accounts.
        </p>

        {error && (
          <p className="text-sm text-[#803d2e]" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-forest" role="status">
            {message}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button className={buttonClass} disabled={busy} type="submit">
            {busy ? 'Saving…' : 'Save changes'}
          </button>

          <Link className={secondaryButtonClass} to="/profile">
            Cancel
          </Link>
        </div>
      </form>
    )}
  </div>
</section>
)}

export default EditProfilePage
