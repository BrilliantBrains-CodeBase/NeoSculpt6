import { useReveal } from '../useReveal'

// Technology section 4: "Why a Personalised Assessment Matters", the current site's slim highlight band
// (technology-international-patient.md §4): the H2 and the doc's paragraph centred in a narrow reading measure
// between two thin gold rules. No box, colour block or button, so it reads as clinical context, not a promotion.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function TechnologyHighlight({ assessment }: { assessment: { h2: string; paragraph: string } }) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section
      id="technology-assessment"
      aria-labelledby="technology-assessment-heading"
      className="mx-auto mb-20 w-full max-w-[1060px] px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <div
        ref={ref}
        data-reveal="up"
        className="flex flex-col items-center max-md:items-start gap-5 border-y border-tertiary/40 py-[50px] text-center max-md:text-left md:py-[60px] xl:py-20"
      >
        <h2 id="technology-assessment-heading" className="font-heading text-h3 text-balance text-secondary uppercase">
          {assessment.h2}
        </h2>
        <p className="max-w-[760px]">{assessment.paragraph}</p>
      </div>
    </section>
  )
}
