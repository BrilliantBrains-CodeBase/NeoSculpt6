import type { ServiceContent, ServiceDoctor as Doctor } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { delay, eyebrow, h2, italicLine } from '../shared'
import { CtaButton } from './CtaButton'

// Service section 7: Rejuvita "Board-Certified Team" (services__rhinoplasty; card styles post-111.css): centred
// eyebrow and title, then the doctor cards. Each card is one wide `alternate` card (20px radius) that also holds the
// current-site doctor block (service-page.md §7): the round portrait (initials until there is one) at the left; name,
// speciality line, the block's eyebrow and paragraphs, the chips and "Know More" at the right. Most pages name one
// doctor; some name two (Blepharoplasty, Chin Augmentation), stacked in the doc's order. Figures among the chips are
// tracked for sign-off in the page's `pending` list. Technology pages have no doctor block (`blockEyebrow: null`) and a
// profile button that already names the doctor ("Meet Dr. Sandeep Mahapatra"); where their doc sets two cards side by
// side (`columns`), each card stacks its portrait above the text from xl up as well, and International Patients adds
// its section paragraph under the heading (`intro`). Speciality hubs add a booking button beside the
// profile link (`cta`). Below xl the portrait sits above the text.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceDoctor({ doctors }: { doctors: ServiceContent['doctors'] }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const introRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="service-doctor"
      aria-labelledby="service-doctor-heading"
      className="mx-auto mb-20 flex w-full max-w-[1260px] flex-col items-center gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      {doctors.eyebrow && (
        <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
          {doctors.eyebrow}
        </p>
      )}
      <h2
        id="service-doctor-heading"
        ref={titleRef}
        data-reveal="up"
        style={delay(150)}
        className={doctors.intro?.length ? `${h2} text-center text-balance` : `${h2} mb-10 text-center md:mb-[60px]`}
      >
        {doctors.h2}
      </h2>
      {doctors.intro?.length ? (
        <div ref={introRef} data-reveal="up" style={delay(300)} className="mb-10 flex max-w-[860px] flex-col gap-5 text-center md:mb-[60px]">
          {doctors.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      ) : null}
      <div className={doctors.columns ? 'grid w-full grid-cols-1 gap-[30px] md:gap-10 xl:grid-cols-2' : 'flex w-full flex-col gap-[30px] md:gap-10'}>
        {doctors.cards.map((doctor) => (
          <DoctorPanel key={doctor.name} doctor={doctor} compact={doctors.columns} />
        ))}
      </div>
    </section>
  )
}

function DoctorPanel({ doctor, compact = false }: { doctor: Doctor; compact?: boolean }) {
  const cardRef = useReveal<HTMLElement>()

  return (
    <article
      ref={cardRef}
      data-reveal="up"
      style={delay(300)}
      className={compact ? 'grid w-full grid-cols-1 content-start items-center gap-10 rounded-[20px] bg-alternate p-[30px] shadow-[0_5px_20px_0_#0000001a] md:gap-[50px] md:p-[50px]' : 'grid w-full grid-cols-1 items-center gap-10 rounded-[20px] bg-alternate p-[30px] shadow-[0_5px_20px_0_#0000001a] md:gap-[50px] md:p-[50px] xl:grid-cols-[300px_1fr] xl:gap-[70px] xl:p-[70px]'}
    >
      <div className={compact ? 'mx-auto w-full max-w-[220px]' : 'mx-auto w-full max-w-[260px] xl:max-w-none'}>
        {doctor.portrait ? (
          <img
            src={doctor.portrait.src}
            width={doctor.portrait.width}
            height={doctor.portrait.height}
            alt={doctor.portrait.alt}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-full object-cover object-top"
          />
        ) : (
          <div aria-hidden="true" className="grid aspect-square w-full place-items-center rounded-full bg-border font-heading text-h2 text-tertiary uppercase">
            {doctor.initials}
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-heading text-h3 text-secondary uppercase">{doctor.name}</h3>
          <p className="text-primary">{doctor.specialty}</p>
        </div>
        {doctor.blockEyebrow && <p className={`${italicLine} mt-2.5 text-tertiary`}>{doctor.blockEyebrow}</p>}
        {doctor.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <ul aria-label={`${doctor.name}: experience and qualifications`} className="flex flex-wrap gap-2.5">
          {doctor.chips.map((chip) => (
            <li key={chip} className="rounded-full border border-border px-4 py-1.5 text-meta text-secondary">
              {chip}
            </li>
          ))}
        </ul>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-[30px] gap-y-5 border-t border-border pt-5">
          <SmartLink
            href={doctor.href}
            className="inline-flex items-center gap-2.5 text-button font-semibold text-secondary uppercase transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2"
          >
            {doctor.profileLabel}
            {!doctor.profileLabel.includes(doctor.name) && <span className="sr-only">: {doctor.name}</span>}
            <ArrowRightIcon className="size-3 shrink-0" />
          </SmartLink>
          {doctor.cta && <CtaButton cta={doctor.cta} />}
        </div>
      </div>
    </article>
  )
}
