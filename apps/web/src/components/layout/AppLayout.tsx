import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { pages } from '../../app/navigation'
import { useAuth } from '../../features/auth/useAuth'

function AppLayout() {
  const {
    user,
    loading,
    error,
    profileStatus,
    profileError,
    retryProfile,
    signOut,
  } = useAuth()

  const [signOutError, setSignOutError] = useState<string | null>(null)

  async function handleSignOut() {
    setSignOutError(null)

    try {
      await signOut()
    } catch (signOutFailure) {
      setSignOutError(
        signOutFailure instanceof Error
          ? signOutFailure.message
          : 'Unable to sign out. Please try again.',
      )
    }
  }

  const containerClass = 'mx-auto w-[min(1120px,calc(100%-40px))] max-[520px]:w-[calc(100%-28px)]'

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2',
      'text-sm font-medium no-underline transition-colors',
      'hover:bg-soft-green hover:text-forest',
      'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay',
      'max-[520px]:px-3 max-[520px]:text-xs',
      isActive
        ? 'bg-soft-green text-forest'
        : 'text-muted',
    ].join(' ')

  const accountLinkClass =
    'inline-flex min-h-10 items-center justify-center rounded-full px-3 py-2 text-xs font-semibold text-forest no-underline transition-colors hover:bg-soft-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay'

  return (
    <div className="flex min-h-screen flex-col" id="home">
      <header className="border-b border-border bg-surface">
        <div
          className={`${containerClass} flex min-h-[88px] flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4`}
        >
          <Link
            className="inline-flex shrink-0 items-center gap-3 text-ink no-underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-clay"
            to="/"
            aria-label="Open Word & Way home"
          >
            <span
              className="grid size-10 place-items-center rounded-[50%_50%_45%_45%] bg-forest font-serif text-xl font-semibold text-[#fffdf8]"
              aria-hidden="true"
            >
              W
            </span>

            <span className="font-serif text-[22px] font-semibold tracking-[-0.6px] max-[390px]:text-[19px]">
              Word <span className="text-clay">&amp;</span> Way
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {loading ? (
              <span className="px-3 py-2 text-xs text-muted" role="status">
                Checking account…
              </span>
            ) : user ? (
              <>
                {user.email && (
                  <span
                    className="max-w-44 truncate px-2 text-xs text-muted max-[520px]:hidden"
                    title={user.email}
                  >
                    {user.email}
                  </span>
                )}

                <Link className={accountLinkClass} to="/profile">
                  Profile
                </Link>

                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-forest transition-colors hover:bg-soft-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSignOut}
                  type="button"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link className={accountLinkClass} to="/auth/login">
                  Sign in
                </Link>

                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white no-underline transition-colors hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  to="/auth/register"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <nav
            className="flex w-full flex-wrap items-center gap-2 border-t border-border pt-3 max-[520px]:justify-between max-[520px]:gap-1"
            aria-label="Main navigation"
          >
            {pages.map(({ label, to }) => (
              <NavLink
                className={navLinkClass}
                to={to}
                end={to === '/'}
                key={to}
              >
                {label}
              </NavLink>
            ))}

            {!loading && user && (
              <>
                <NavLink className={navLinkClass} to="/editorial">
                  Editorial
                </NavLink>

                <NavLink className={navLinkClass} to="/teacher">
                  Teacher demo
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      {(error || signOutError) && (
        <p
          className={`${containerClass} mt-3 text-sm text-[#803d2e]`}
          role="alert"
        >
          {signOutError ?? error}
        </p>
      )}

      {user && profileStatus === 'loading' && (
        <p
          className={`${containerClass} mt-3 text-sm text-muted`}
          role="status"
        >
          Setting up your profile…
        </p>
      )}

      {user && profileError && (
        <div
          className={`${containerClass} mt-3 flex flex-wrap items-center gap-3 text-sm text-[#803d2e]`}
          role="alert"
        >
          <span>
            Your profile could not be initialized: {profileError}
          </span>

          <button
            className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={retryProfile}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      <main className="grow">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-border">
        <div
          className={`${containerClass} flex min-h-[72px] flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted max-[390px]:flex-col max-[390px]:items-start max-[390px]:justify-center`}
        >
          <span className="font-serif text-sm font-semibold text-forest">
            Word &amp; Way
          </span>

          <span>A place to read, learn, and grow.</span>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout