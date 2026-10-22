import type { ServiceContent } from '../../data/services/types'
import { doctors } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { delay, eyebrow, h2, italicLine } from '../shared'

// Service section 7: Rejuvita "Board-Certified Team" (services__rhinoplasty; card styles post-111.css): centred
// eyebrow and title, then the doctor card. A service page names one doctor, so the theme's 3-up card row becomes one
// wide `alternate` card (20px radius) that also holds the current-site doctor block (service-page.md §7): the round
// portrait at the left; name, speciality line, the block's eyebrow and paragraphs, the chips and "Know More" at the
// right. The name and profile link come from data/home.ts `doctors.cards`; figures among the chips are tracked for
// sign-off in the page's `pending` list. Below xl the portrait sits above the text.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceDoctor({ doctor }: { doctor: ServiceContent['doctor'] }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const cardRef = useReveal<HTMLElement>()
  const card = doctors.cards.find((c) => c.name === doctor.doctor)
  if (!card) throw new Error(`No doctor card for ${doctor.doctor}`)
  const portrait = doctor.portrait ?? card.portrait

  return (
    <section
      id="service-doctor"
      aria-labelledby="service-doctor-heading"
      className="mx-auto mb-20 flex w-full max-w-[1260px] flex-col items-center gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
        {doctor.eyebrow}
      </p>
      <h2 id="service-doctor-heading" ref={titleRef} data-reveal="up" style={delay(150)} className={`${h2} mb-10 text-center md:mb-[60px]`}>
        {doctor.h2}
      </h2>

      <article
        ref={cardRef}
        data-reveal="up"
        style={delay(300)}
        className="grid w-full grid-cols-1 items-center gap-10 rounded-[20px] bg-alternate p-[30px] shadow-[0_5px_20px_0_#0000001a] md:gap-[50px] md:p-[50px] xl:grid-cols-[300px_1fr] xl:gap-[70px] xl:p-[70px]"
      >
        <div className="mx-auto w-full max-w-[260px] xl:max-w-none">
          {portrait ? (
            <img
              src={portrait.src}
              width={portrait.width}
              height={portrait.height}
              alt={portrait.alt}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-full object-cover object-top"
            />
          ) : (
            <div aria-hidden="true" className="grid aspect-square w-full place-items-center rounded-full bg-border font-heading text-h2 text-tertiary uppercase">
              {card.initials}
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading text-h3 text-secondary uppercase">{card.name}</h3>
            <p className="text-primary">{doctor.specialty}</p>
          </div>
          <p className={`${italicLine} mt-2.5 text-tertiary`}>{doctor.blockEyebrow}</p>
          {doctor.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul aria-label={`${card.name}: experience and qualifications`} className="flex flex-wrap gap-2.5">
            {doctor.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-border px-4 py-1.5 text-meta text-secondary">
                {chip}
              </li>
            ))}
          </ul>
          <SmartLink
            href={card.href}
            className="mt-2.5 inline-flex items-center gap-2.5 border-t border-border pt-5 text-button font-semibold text-secondary uppercase transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2"
          >
            {doctor.profileLabel}
            <span className="sr-only">: {card.name}</span>
            <ArrowRightIcon className="size-3 shrink-0" />
          </SmartLink>
        </div>
      </article>
    </section>
  )
}
