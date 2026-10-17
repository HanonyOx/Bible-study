import { useEffect, useState, type FormEvent } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import type { ReactNode } from 'react'
import { getSupabaseClient } from '../../services/supabaseClient'
import { useAuth } from './useAuth'
import {
  getAgeGroupForDateOfBirth,
  getLocalDateInputValue,
} from './ageGroups.mjs'

const authPageClass =
  'mx-auto w-[min(100%-40px,480px)] py-12 max-[520px]:py-8'
const panelClass =
  'rounded-xl border border-border bg-surface p-8 shadow-[0_8px_24px_rgba(41,52,46,0.05)] max-[520px]:p-5'
const inputClass =
  'mt-2 block w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green'
const buttonClass =
  'inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:cursor-not-allowed disabled:opacity-60'

function FormMessage({
  children,
  kind,
}: {
  children: string
  kind: 'error' | 'success'
}) {
  return (
    <p
      className={`mt-4 rounded-md px-3 py-2 text-sm leading-6 ${
        kind === 'error'
          ? 'bg-[#fbefeb] text-[#803d2e]'
          : 'bg-soft-green text-forest'
      }`}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  )
}

function PageFrame({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className={authPageClass}>
      <div className={panelClass}>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[1.3px] text-clay">
          Word &amp; Way account
        </p>
        <h1 className="mb-2 font-serif text-3xl font-medium text-ink">
          {title}
        </h1>
        <p className="mb-6 text-sm leading-6 text-muted">{description}</p>
        {children}
      </div>
    </section>
  )
}

function LoginPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestedPath = location.state?.from?.pathname
  const from =
    typeof requestedPath === 'string' &&
    requestedPath.startsWith('/') &&
    !requestedPath.startsWith('//') &&
    !requestedPath.startsWith('/auth/')
      ? requestedPath
      : '/'

  const verified = searchParams.get('verified') === '1'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setBusy(true)

    try {
      const { error: signInError } =
        await getSupabaseClient().auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (signInError) throw signInError

      navigate(from, { replace: true })
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Unable to sign in. Check your details and try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageFrame
      title="Welcome back"
      description="Sign in to your Word & Way account."
    >
      {verified && (
        <FormMessage kind="success">
          Your email has been confirmed. You can now sign in.
        </FormMessage>
      )}

      {user && (
        <FormMessage kind="success">
          You are already signed in. Continue using the navigation.
        </FormMessage>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="login-email"
        >
          Email address
          <input
            autoComplete="email"
            className={inputClass}
            id="login-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="login-password"
        >
          Password
          <input
            autoComplete="current-password"
            className={inputClass}
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {error && <FormMessage kind="error">{error}</FormMessage>}

        <button
          className={`${buttonClass} w-full`}
          disabled={busy}
          type="submit"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
        <Link className="text-forest underline" to="/auth/forgot-password">
          Forgot password?
        </Link>

        <Link className="text-forest underline" to="/auth/register">
          Create an account
        </Link>
      </div>
    </PageFrame>
  )
}

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [accountType, setAccountType] = useState<
    'student' | 'teacher_applicant'
  >('student')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const ageGroup = dateOfBirth
    ? getAgeGroupForDateOfBirth(dateOfBirth)
    : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }

    if (!dateOfBirth || !ageGroup) {
      setError(
        'Enter a valid date of birth for someone at least 1 year old.',
      )
      return
    }

    const birthDate = new Date(`${dateOfBirth}T00:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (
      Number.isNaN(birthDate.getTime()) ||
      birthDate > today
    ) {
      setError('Enter a valid date of birth that is not in the future.')
      return
    }

    if (ageGroup === 'children') {
      setError(
        'Online self-registration is unavailable for children under 13. A guardian-managed account process is required.',
      )
      return
    }

    setBusy(true)

    try {
      const origin = window.location.origin

      const { data, error: signUpError } =
        await getSupabaseClient().auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
              age_group: ageGroup,
              account_type_requested: accountType,
            },
          },
        })

      if (signUpError) throw signUpError

      setSuccess(
        data.session
          ? 'Your account is ready. You are now signed in.'
          : 'Account created. Check your email for a verification link before signing in.',
      )

      setPassword('')
      setConfirmation('')
    } catch (signUpError) {
      setError(
        signUpError instanceof Error
          ? signUpError.message
          : 'Unable to create your account. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageFrame
      title="Create your account"
      description="Join Word & Way to access Bible study and Sunday School learning resources."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="register-email"
        >
          Email address
          <input
            autoComplete="email"
            className={inputClass}
            id="register-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <div>
          <label
            className="block text-sm font-semibold text-ink"
            htmlFor="register-date-of-birth"
          >
            Date of birth
            <input
              autoComplete="bday"
              className={inputClass}
              id="register-date-of-birth"
              max={getLocalDateInputValue()}
              onChange={(event) => setDateOfBirth(event.target.value)}
              required
              type="date"
              value={dateOfBirth}
            />
          </label>

          {ageGroup && (
            <p className="mt-2 text-sm text-muted" aria-live="polite">
              Your self-reported age group:{' '}
              {ageGroup === 'children'
                ? 'Children (1–12)'
                : ageGroup === 'teens'
                  ? 'Teenagers (13–19)'
                  : 'Adults (20+)'}
              .
            </p>
          )}

          <p className="mt-2 text-xs leading-5 text-muted">
            Your date of birth is used to calculate your age group and is not
            saved by this form. Age groups do not grant permissions. Users
            under 13 require a guardian-managed registration process, which
            is not currently available.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-ink">
            What type of account do you need?
          </legend>

          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-4 transition-colors has-[:checked]:border-forest has-[:checked]:bg-soft-green">
            <input
              checked={accountType === 'student'}
              className="mt-1 accent-[#365b43]"
              name="accountType"
              onChange={() => setAccountType('student')}
              type="radio"
              value="student"
            />

            <span>
              <span className="block text-sm font-semibold text-ink">
                Student
              </span>
              <span className="mt-1 block text-sm leading-5 text-muted">
                I want to access Bible study and Sunday School learning
                materials.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-4 transition-colors has-[:checked]:border-forest has-[:checked]:bg-soft-green">
            <input
              checked={accountType === 'teacher_applicant'}
              className="mt-1 accent-[#365b43]"
              name="accountType"
              onChange={() => setAccountType('teacher_applicant')}
              type="radio"
              value="teacher_applicant"
            />

            <span>
              <span className="block text-sm font-semibold text-ink">
                Teacher applicant
              </span>
              <span className="mt-1 block text-sm leading-5 text-muted">
                I want to teach Sunday School and request teacher access.
                Approval is required before teacher-only features can be used.
              </span>
            </span>
          </label>
        </fieldset>

        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="register-password"
        >
          Password
          <input
            autoComplete="new-password"
            className={inputClass}
            id="register-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          <span className="mt-1 block text-xs font-normal text-muted">
            Use at least 8 characters.
          </span>
        </label>

        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="register-confirmation"
        >
          Confirm password
          <input
            autoComplete="new-password"
            className={inputClass}
            id="register-confirmation"
            onChange={(event) => setConfirmation(event.target.value)}
            required
            type="password"
            value={confirmation}
          />
        </label>

        {error && <FormMessage kind="error">{error}</FormMessage>}
        {success && <FormMessage kind="success">{success}</FormMessage>}

        <button
          className={`${buttonClass} w-full`}
          disabled={busy}
          type="submit"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mb-0 mt-5 text-sm text-muted">
        Already registered?{' '}
        <Link className="text-forest underline" to="/auth/login">
          Sign in
        </Link>
      </p>
    </PageFrame>
  )
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setBusy(true)

    try {
      const { error: resetError } =
        await getSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

      if (resetError) throw resetError
      setSuccess(true)
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : 'Unable to request a password reset. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageFrame
      title="Reset your password"
      description="Enter your account email and we will send a secure password-reset link."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor="reset-email"
        >
          Email address
          <input
            autoComplete="email"
            className={inputClass}
            id="reset-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        {error && <FormMessage kind="error">{error}</FormMessage>}

        {success && (
          <FormMessage kind="success">
            If an account uses that address, a password-reset email has been
            sent. Check your inbox and spam folder.
          </FormMessage>
        )}

        <button
          className={`${buttonClass} w-full`}
          disabled={busy}
          type="submit"
        >
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="mb-0 mt-5 text-sm text-muted">
        <Link className="text-forest underline" to="/auth/login">
          Return to sign in
        </Link>
      </p>
    </PageFrame>
  )
}

function SetNewPasswordPage() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    void Promise.resolve()
      .then(() => {
        if (!active) return null

        const client = getSupabaseClient()
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((event, session) => {
          if (active && (event === 'PASSWORD_RECOVERY' || session)) {
            setReady(true)
            setError(null)
          }
        })

        unsubscribe = () => subscription.unsubscribe()
        return client.auth.getSession()
      })
      .then((result) => {
        if (active && result) {
          if (result.error) throw result.error

          if (result.data.session) {
            setReady(true)
          } else {
            setError(
              'This link is invalid or expired. Request a new reset link to continue.',
            )
          }
        }
      })
      .catch((clientError: unknown) => {
        if (active) {
          setError(
            clientError instanceof Error
              ? clientError.message
              : 'Unable to verify this reset link.',
          )
        }
      })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }

    setBusy(true)

    try {
      const { error: updateError } =
        await getSupabaseClient().auth.updateUser({ password })

      if (updateError) throw updateError

      setSuccess(true)
      setPassword('')
      setConfirmation('')
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update your password. Request a new reset link and try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  if (!ready) {
    return (
      <PageFrame
        title="Password reset link"
        description="Verifying your secure reset link."
      >
        {error ? (
          <>
            <FormMessage kind="error">{error}</FormMessage>
            <Link
              className="mt-5 inline-block text-sm text-forest underline"
              to="/auth/forgot-password"
            >
              Request another reset link
            </Link>
          </>
        ) : (
          <p className="mb-0 text-sm text-muted" role="status">
            Checking reset link…
          </p>
        )}
      </PageFrame>
    )
  }

  return (
    <PageFrame
      title="Choose a new password"
      description="Set a new password for your account."
    >
      {success ? (
        <>
          <FormMessage kind="success">
            Your password has been updated.
          </FormMessage>
          <Link className="mt-5 inline-block text-sm text-forest underline" to="/">
            Continue to Word &amp; Way
          </Link>
        </>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label
            className="block text-sm font-semibold text-ink"
            htmlFor="new-password"
          >
            New password
            <input
              autoComplete="new-password"
              className={inputClass}
              id="new-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <label
            className="block text-sm font-semibold text-ink"
            htmlFor="new-password-confirmation"
          >
            Confirm new password
            <input
              autoComplete="new-password"
              className={inputClass}
              id="new-password-confirmation"
              onChange={(event) => setConfirmation(event.target.value)}
              required
              type="password"
              value={confirmation}
            />
          </label>

          {error && <FormMessage kind="error">{error}</FormMessage>}

          <button
            className={`${buttonClass} w-full`}
            disabled={busy}
            type="submit"
          >
            {busy ? 'Updating password…' : 'Update password'}
          </button>
        </form>
      )}
    </PageFrame>
  )
}

function AuthCallbackPage() {
  const [status, setStatus] = useState<'working' | 'success' | 'error'>(
    'working',
  )
  const [message, setMessage] = useState(
    'Verifying your email address…',
  )

  useEffect(() => {
    let active = true

    async function processCallback() {
      try {
        const params = new URLSearchParams(window.location.search)
        const providerError =
          params.get('error_description') ?? params.get('error')

        if (providerError) throw new Error(providerError)

        const { data, error: sessionError } =
          await getSupabaseClient().auth.getSession()

        if (sessionError) throw sessionError

        if (!data.session) {
          throw new Error(
            'This confirmation link is invalid or expired. Register again or sign in if your email is already confirmed.',
          )
        }

        if (active) {
          setMessage(
            'Your email is confirmed. You can continue to Word & Way.',
          )
          setStatus('success')
        }
      } catch (callbackError) {
        if (active) {
          setMessage(
            callbackError instanceof Error
              ? callbackError.message
              : 'This confirmation link is invalid or expired. Please try again.',
          )
          setStatus('error')
        }
      }
    }

    void processCallback()

    return () => {
      active = false
    }
  }, [])

  return (
    <PageFrame
      title="Email confirmation"
      description="We are confirming your account email."
    >
      {status === 'working' ? (
        <p className="mb-0 text-sm text-muted" role="status">
          {message}
        </p>
      ) : (
        <>
          <FormMessage kind={status === 'success' ? 'success' : 'error'}>
            {message}
          </FormMessage>

          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            {status === 'success' ? (
              <Link
                className="text-forest underline"
                to="/auth/login?verified=1"
              >
                Sign in
              </Link>
            ) : (
              <Link className="text-forest underline" to="/auth/register">
                Return to registration
              </Link>
            )}

            <Link className="text-forest underline" to="/">
              Go to Home
            </Link>
          </div>
        </>
      )}
    </PageFrame>
  )
}

export {
  AuthCallbackPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  SetNewPasswordPage,
}