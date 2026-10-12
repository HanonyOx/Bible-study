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

  return (
    <div className="flex min-h-screen flex-col" id="home">
      <header className="mx-auto flex min-h-[84px] w-[min(1120px,calc(100%-64px))] items-center justify-between gap-8 border-b border-border max-[720px]:min-h-[72px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:flex-wrap max-[720px]:gap-x-[18px] max-[720px]:gap-y-[6px] max-[720px]:py-[13px] max-[720px]:pb-[10px] max-[390px]:w-[calc(100%-28px)]">
        <Link
          className="inline-flex items-center gap-[11px] text-ink no-underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-clay"
          to="/"
          aria-label="Open Word & Way home"
        >
          <span
            className="grid size-9 place-items-center rounded-[50%_50%_45%_45%] bg-forest font-serif text-xl font-semibold text-[#fffdf8] max-[720px]:size-8"
            aria-hidden="true"
          >
            W
          </span>
          <span className="font-serif text-[21px] font-semibold tracking-[-0.6px] max-[720px]:text-[19px]">
            Word <span className="text-clay">&amp;</span> Way
          </span>
        </Link>

        <div className="flex items-center gap-3 max-[720px]:ml-auto">
          {!loading && user ? (
            <>
              <span
                className="max-w-40 truncate text-xs text-muted max-[390px]:hidden"
                title={user.email ?? 'Signed in'}
              >
                {user.email ?? 'Signed in'}
              </span>
              <button
                className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-forest transition-colors hover:bg-soft-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:opacity-60"
                onClick={handleSignOut}
                type="button"
              >
                Sign out
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link
                  className="text-xs font-semibold text-forest no-underline hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  to="/auth/login"
                >
                  Sign in
                </Link>
                <Link
                  className="rounded-full bg-forest px-3 py-2 text-xs font-semibold text-white no-underline hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  to="/auth/register"
                >
                  Create account
                </Link>
              </>
            )
          )}
        </div>

        <nav
          className="flex items-center gap-2 max-[720px]:w-full max-[720px]:justify-between max-[720px]:gap-[2px]"
          aria-label="Main navigation"
        >
          {pages.map(({ label, to }) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-[15px] py-[10px] text-sm text-muted no-underline transition-colors duration-[160ms] hover:bg-soft-green hover:text-forest focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-clay max-[720px]:px-[10px] max-[720px]:py-2 max-[720px]:text-xs max-[390px]:px-[7px] max-[390px]:text-[11px]${isActive ? ' bg-soft-green text-forest' : ''}`
              }
              to={to}
              end={to === '/'}
              key={to}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {(error || signOutError) && (
        <p
          className="mx-auto mt-3 w-[min(1120px,calc(100%-64px))] text-sm text-[#803d2e] max-[720px]:w-[min(100%-36px,560px)]"
          role="alert"
        >
          {signOutError ?? error}
        </p>
      )}

      {user && profileStatus === 'loading' && (
        <p
          className="mx-auto mt-3 w-[min(1120px,calc(100%-64px))] text-sm text-muted max-[720px]:w-[min(100%-36px,560px)]"
          role="status"
        >
          Setting up your profile…
        </p>
      )}

      {user && profileError && (
        <div
          className="mx-auto mt-3 flex w-[min(1120px,calc(100%-64px))] flex-wrap items-center gap-3 text-sm text-[#803d2e] max-[720px]:w-[min(100%-36px,560px)]"
          role="alert"
        >
          <span>Your profile could not be initialized: {profileError}</span>
          <button
            className="font-semibold underline"
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

      <footer className="mx-auto flex min-h-[68px] w-[min(1120px,calc(100%-64px))] items-center justify-between gap-4 border-t border-border text-[11px] text-muted max-[720px]:min-h-[60px] max-[720px]:w-[min(100%-36px,560px)] max-[390px]:w-[calc(100%-28px)] max-[390px]:flex-col max-[390px]:items-start max-[390px]:justify-center max-[390px]:gap-[3px]">
        <span className="font-serif text-sm font-semibold text-forest">
          Word &amp; Way
        </span>
        <span>A place to read, learn, and grow.</span>
      </footer>
    </div>
  )
}

export default AppLayout
