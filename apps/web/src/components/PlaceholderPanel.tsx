function PlaceholderPanel({
  eyebrow,
  title,
  description,
  label,
}: {
  eyebrow: string
  title: string
  description: string
  label: string
}) {
  return (
    <div className="mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]">
      <section className="flex min-h-[480px] flex-col items-start justify-center rounded-[10px] border border-[#e9e3d5] bg-paper px-[8%] py-10 max-[720px]:min-h-[440px] max-[720px]:px-[23px] max-[720px]:py-8">
        <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
          {eyebrow}
        </p>
        <h1 className="mb-[17px] max-w-[540px] font-serif text-[clamp(38px,5vw,57px)] leading-[1.08] font-medium tracking-[-1.7px] text-ink">
          {title}
        </h1>
        <p className="mb-8 max-w-[460px] text-base leading-[1.75] text-muted">
          {description}
        </p>
        <div className="flex min-h-[150px] w-full max-w-[600px] flex-col items-center justify-center gap-2 rounded-[7px] border border-dashed border-[#d8d0c0] bg-[rgba(255,253,248,0.65)] text-center">
          <span
            className="grid size-[29px] place-items-center rounded-full bg-soft-green text-[19px] leading-none text-forest"
            aria-hidden="true"
          >
            +
          </span>
          <p className="m-0 font-serif text-base text-ink">{label}</p>
          <span className="text-[10px] text-muted">
            Placeholder · no licensed content
          </span>
        </div>
      </section>
    </div>
  )
}

export default PlaceholderPanel
