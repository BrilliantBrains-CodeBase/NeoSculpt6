import type { CSSProperties } from 'react'
import { founder, saranya } from '../../data/about'
import { useReveal } from '../useReveal'
import { useParallax } from '../useParallax'
import { SmartLink } from '../SmartLink'
import { Marquee } from '../Marquee'
import { TickIcon } from '../icons'
import { Parts, button, delay, eyebrow, h2 } from '../shared'

// About extra C: founder spotlight (about-us.md §C). Reuses the home About intro layout (HomeAbout: Rejuvita
// 9652eff > f250a0c, large photo with a drifting inset, text column), adds the education checklist and a teaching
// ticker (the home Marquee), then a shorter mirrored block for Dr Saranya T.
// The quote shows only once Dr Sandeep has approved it (`founder.quote.signedOff` in data/about.ts).
// Dr Saranya's portrait is an initials circle until the clinic shoot is in, as on the home doctor cards.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutFounder() {
  const imageRef = useReveal<HTMLDivElement>()
  const imageParallaxRef = useParallax<HTMLDivElement>(1)
  const insetRef = useParallax<HTMLDivElement>(2)
  const textRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLUListElement>()
  const tickerRef = useReveal<HTMLDivElement>()

  return (
    <section id="founder" aria-labelledby="founder-heading" className="bg-alternate pt-20 md:pt-[100px] xl:pt-[150px]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col-reverse gap-20 px-5 md:gap-[70px] md:px-[30px] xl:flex-row xl:gap-[180px] xl:px-10">
        {/* Image box, as HomeAbout */}
        <div ref={imageRef} data-reveal className="w-[90%] md:mb-[55px] md:w-[580px] xl:mb-[95px] xl:w-[45%] xl:shrink-0">
          <div ref={imageParallaxRef} className="relative h-full min-h-[420px] md:min-h-[685px]">
            <img
              src={founder.portrait.src}
              width={founder.portrait.width}
              height={founder.portrait.height}
              alt={founder.portrait.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full rounded-[20px] object-cover object-top"
            />
            <div
              ref={insetRef}
              className="absolute right-[-43px] bottom-[-44px] md:right-[-105px] md:bottom-[-75px] xl:right-[-80px] xl:bottom-[-95px]"
            >
              <img
                src={founder.inset.src}
                width={founder.inset.width}
                height={founder.inset.height}
                alt={founder.inset.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[9/10] h-auto w-[120px] rounded-[20px] object-cover md:w-[260px]"
              />
            </div>
          </div>
        </div>

        {/* Text column */}
        <div ref={textRef} data-reveal="up" className="flex w-full flex-col items-start justify-center gap-[25px]">
          <p className={eyebrow}>{founder.eyebrow}</p>
          <h2 id="founder-heading" className={h2}>
            <Parts parts={founder.h2} />
          </h2>
          <p className="text-primary">{founder.title}</p>
          <p>{founder.text}</p>
          {founder.quote.signedOff && (
            <figure className="border-l-2 border-tertiary pl-5">
              <blockquote className="font-accent-serif text-[20px] leading-[1.4] text-secondary italic md:text-[22px]">
                <p>“{founder.quote.text}”</p>
              </blockquote>
              <figcaption className="mt-2 text-meta text-text">Dr Sandeep Mahapatra</figcaption>
            </figure>
          )}
          <ul ref={listRef} data-reveal-stagger="" aria-label="Education and training" className="flex flex-col gap-[15px]">
            {founder.checklist.map((item, i) => (
              <li key={item.title} style={{ '--i': i } as CSSProperties} className="flex gap-[15px]">
                <TickIcon className="mt-1 size-4 shrink-0 text-tertiary" />
                <span>
                  <span className="text-secondary">{item.title}</span>
                  <span className="block text-small text-text/80">{item.place}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-[5px]">
            <SmartLink href={founder.cta.href} className={button}>
              {founder.cta.label}
            </SmartLink>
          </div>
        </div>
      </div>

      {/* Teaching ticker */}
      <div ref={tickerRef} data-reveal="" style={delay(150)} className="mt-[100px] border-y border-border md:mt-[140px] xl:mt-[160px]">
        <Marquee
          items={founder.ticker}
          separator="✦"
          pausable
          label="Teaching and publications"
          className="py-[30px] [--marquee-gap:60px] [--marquee-item-gap:60px]"
          itemClassName="font-heading text-h5 text-secondary uppercase"
          separatorClassName="text-[28px] leading-none text-tertiary"
        />
      </div>

      <SaranyaBlock />
    </section>
  )
}

// Dr Saranya T: text left, portrait right on desktop (the founder row mirrored); portrait first below that.
function SaranyaBlock() {
  const portraitRef = useReveal<HTMLDivElement>()
  const textRef = useReveal<HTMLDivElement>()

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-20 md:gap-[60px] md:px-[30px] md:py-[100px] xl:flex-row-reverse xl:items-center xl:gap-[120px] xl:px-10 xl:py-[150px]">
      <div ref={portraitRef} data-reveal="pop" className="mx-auto w-full max-w-[320px] md:max-w-[380px] xl:mx-0 xl:w-[380px] xl:shrink-0">
        {saranya.portrait ? (
          <img
            src={saranya.portrait.src}
            width={saranya.portrait.width}
            height={saranya.portrait.height}
            alt={saranya.portrait.alt}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-full object-cover object-top"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid aspect-square w-full place-items-center rounded-full bg-border font-heading text-h1 text-tertiary uppercase"
          >
            {saranya.initials}
          </div>
        )}
      </div>

      <div ref={textRef} data-reveal="up" className="flex flex-col items-start gap-5">
        <h3 className="font-heading text-h3 text-secondary uppercase">
          {saranya.name}
          <span className="mt-2 block font-body text-h6 font-medium tracking-[2px] text-primary">{saranya.title}</span>
        </h3>
        <ul aria-label="Qualifications" className="flex flex-col gap-1.5 text-small text-text/90">
          {saranya.qualifications.map((q) => (
            <li key={q} className="flex gap-[15px]">
              <TickIcon className="mt-1 size-4 shrink-0 text-tertiary" />
              {q}
            </li>
          ))}
        </ul>
        <p>{saranya.text}</p>
        <ul aria-label="Areas of expertise" className="flex flex-wrap gap-2.5">
          {saranya.chips.map((chip) => (
            <li key={chip} className="rounded-full border border-border px-4 py-1.5 text-meta text-secondary">
              {chip}
            </li>
          ))}
        </ul>
        <div className="mt-2.5">
          <SmartLink href={saranya.cta.href} className={button}>
            {saranya.cta.label}
          </SmartLink>
        </div>
      </div>
    </div>
  )
}
