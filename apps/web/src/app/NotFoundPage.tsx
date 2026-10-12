import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]">
      <section className="flex min-h-[480px] flex-col items-start justify-center rounded-[10px] border border-[#e9e3d5] bg-paper px-[8%] py-10 max-[720px]:min-h-[440px] max-[720px]:px-[23px] max-[720px]:py-8">
        <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
          404 · Page not found
        </p>
        <h1 className="mb-[17px] max-w-[540px] font-serif text-[clamp(38px,5vw,57px)] leading-[1.08] font-medium tracking-[-1.7px] text-ink">
          We couldn’t find that page.
        </h1>
        <p className="mb-8 max-w-[460px] text-base leading-[1.75] text-muted">
          The address may be incorrect, or the page may have moved.
        </p>
        <Link
          className="inline-flex min-h-[47px] items-center justify-center gap-4 rounded-[5px] bg-forest px-[19px] text-sm font-semibold text-white no-underline transition-colors duration-[160ms] hover:bg-[#254e3d] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-clay"
          to="/"
        >
          Return home <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage
