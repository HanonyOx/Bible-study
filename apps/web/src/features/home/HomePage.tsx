import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]">
      <section
        className="grid min-h-[345px] grid-cols-[1.15fr_0.85fr] items-center gap-7 overflow-hidden rounded-[10px] border border-[#e9e3d5] bg-[radial-gradient(ellipse_at_78%_20%,rgba(233,214,176,0.35),transparent_38%),var(--color-paper)] px-[62px] py-[54px] max-[720px]:grid-cols-1 max-[720px]:gap-2 max-[720px]:px-[26px] max-[720px]:pt-[34px] max-[720px]:pb-[18px] max-[390px]:px-5"
        aria-labelledby="welcome-title"
      >
        <div className="max-w-[540px]">
          <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
            A little space for a growing faith
          </p>
          <h1
            id="welcome-title"
            className="mb-[17px] max-w-[540px] font-serif text-[clamp(38px,5vw,57px)] leading-[1.08] font-medium tracking-[-1.7px] text-ink"
          >
            Read, reflect, and learn together.
          </h1>
          <p className="mb-[25px] max-w-[460px] text-base leading-[1.75] text-muted">
            Explore Scripture and discover teaching resources for every
            generation.
          </p>
          <Link
            className="inline-flex min-h-[47px] items-center justify-center gap-4 rounded-[5px] bg-forest px-[19px] text-sm font-semibold text-white no-underline transition-colors duration-[160ms] hover:bg-[#254e3d] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-clay"
            to="/bible"
          >
            Open the Bible reader <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div
          className="relative grid min-h-[235px] place-items-center text-forest max-[720px]:min-h-[176px]"
          aria-hidden="true"
        >
          <div className="absolute top-[14px] left-1/2 size-44 -translate-x-1/2 rounded-full bg-[#e9d6b0] max-[720px]:top-[7px] max-[720px]:size-[136px]" />
          <div className="relative z-[1] flex h-[104px] w-[206px] items-stretch -rotate-4 drop-shadow-[0_12px_12px_rgba(49,48,35,0.12)] max-[720px]:h-[82px] max-[720px]:w-[170px]">
            <span className="w-1/2 -skew-y-[7deg] rounded-[7px_2px_3px_8px] border border-[#dbcfb6] bg-[#fffdf8]" />
            <span className="w-1/2 skew-y-[7deg] rounded-[2px_7px_8px_3px] border border-[#dbcfb6] bg-[#fffdf8]" />
          </div>
          <p className="absolute bottom-[2px] m-0 text-[9px] font-bold tracking-[2px] max-[720px]:bottom-[-2px]">
            READ&nbsp; · &nbsp;REFLECT&nbsp; · &nbsp;GROW
          </p>
        </div>
      </section>

      <section className="pt-[49px] max-[720px]:pt-[35px]" aria-labelledby="explore-title">
        <div className="mb-[22px] flex items-end justify-between gap-7 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-[9px]">
          <div>
            <p className="mb-2 text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
              Your study space
            </p>
            <h2
              id="explore-title"
              className="mb-0 font-serif text-[clamp(24px,3vw,31px)] leading-[1.2] font-medium tracking-[-0.65px] text-ink"
            >
              What would you like to explore?
            </h2>
          </div>
          <p className="mb-[2px] max-w-[315px] text-[13px] leading-[1.6] text-muted max-[720px]:max-w-[420px]">
            Choose a starting point. More features will be added step by step.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1 max-[720px]:gap-[10px]">
          <FeatureCard
            number="01"
            title="Read the Bible"
            description="Find a book and chapter and settle into your reading."
            action="Go to Bible"
            to="/bible"
          />
          <FeatureCard
            number="02"
            title="Compare translations"
            description="Explore two authorized translations side by side."
            action="Open comparison"
            to="/compare"
          />
          <FeatureCard
            number="03"
            title="Sunday School"
            description="A library for lessons across different age groups."
            action="Explore lessons"
            to="/sunday-school"
          />
        </div>
      </section>

      <p className="mt-6 mb-0 text-center text-[11px] leading-[1.6] text-muted">
        This early preview uses placeholder content only. No Bible passages or
        teaching materials are included.
      </p>
    </div>
  )
}

function FeatureCard({
  number,
  title,
  description,
  action,
  to,
}: {
  number: string
  title: string
  description: string
  action: string
  to: string
}) {
  return (
    <article className="flex min-h-[188px] flex-col items-start rounded-[7px] border border-border bg-surface px-[23px] pt-[23px] pb-[19px] max-[720px]:min-h-0 max-[720px]:p-[19px]">
      <span className="mb-[15px] text-[10px] font-bold tracking-[1.2px] text-clay max-[720px]:mb-[9px]">
        {number}
      </span>
      <h3 className="mb-[7px] font-serif text-xl font-medium tracking-[-0.35px] text-ink">
        {title}
      </h3>
      <p className="mb-[17px] text-[13px] leading-[1.6] text-muted">
        {description}
      </p>
      <Link
        className="mt-auto p-0 text-xs font-bold text-forest no-underline hover:text-clay"
        to={to}
      >
        {action} <span className="pl-[5px]" aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

export default HomePage
