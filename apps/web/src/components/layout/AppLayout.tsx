import { Link, NavLink, Outlet } from 'react-router-dom'
import { pages } from '../../app/navigation'

function AppLayout() {
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
