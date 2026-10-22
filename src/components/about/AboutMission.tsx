import type { CSSProperties } from 'react'
import { mission } from '../../data/about'
import { useReveal } from '../useReveal'
import { FlowerIcon } from '../icons'
import { Parts, delay, h2 } from '../shared'

// About extra B: mission and vision, values, process (about-us.md §B). Not in the About theme; built from the home
// page's pieces: the two cards use the price-guide card style (rounded `alternate` panels), the values are icon columns
// with the theme's flower glyph, and the process is a numbered row. Each part has its own H2 from the old About page.
// The process row wraps to two columns on tablet and stacks on phones, so it never scrolls sideways.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutMission() {
  const cardsRef = useReveal<HTMLUListElement>()
  const valuesTitleRef = useReveal<HTMLHeadingElement>()
  const valuesRef = useReveal<HTMLUListElement>()
  const processTitleRef = useReveal<HTMLHeadingElement>()
  const stepsRef = useReveal<HTMLOListElement>()

  return (
    <div id="mission" className="flex flex-col gap-20 px-5 py-20 md:gap-[100px] md:px-[30px] md:py-[100px] xl:gap-[130px] xl:px-10 xl:py-[150px]">
      {/* Mission and vision cards */}
      <ul ref={cardsRef} data-reveal-stagger="" className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px] xl:gap-10">
        {mission.cards.map((card, i) => (
          <li
            key={card.title}
            style={{ '--i': i } as CSSProperties}
            className="flex flex-col gap-5 rounded-[20px] border border-border bg-alternate p-[30px] md:p-10 xl:p-[60px]"
          >
            <h3 className="font-heading text-h4 text-tertiary uppercase">{card.title}</h3>
            <p className="font-accent-serif text-[20px] leading-[1.4] text-secondary italic md:text-[22px] xl:text-[26px]">
              {card.text}
            </p>
          </li>
        ))}
      </ul>

      {/* Values */}
      <section aria-labelledby="values-heading" className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px]">
        <h2 id="values-heading" ref={valuesTitleRef} data-reveal="up" className={`${h2} text-center`}>
          <Parts parts={mission.valuesH2} />
        </h2>
        <ul ref={valuesRef} data-reveal-stagger="" className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-[30px] xl:gap-[60px]">
          {mission.values.map((value, i) => (
            <li key={value.title} style={{ '--i': i } as CSSProperties} className="flex flex-col items-center gap-5 text-center">
              <span aria-hidden="true" className="grid size-[80px] place-items-center rounded-full border border-border text-primary">
                <FlowerIcon />
              </span>
              <h3 className="font-heading text-h5 text-secondary uppercase">{value.title}</h3>
              <p>{value.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section aria-labelledby="process-heading" className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px]">
        <h2 id="process-heading" ref={processTitleRef} data-reveal="up" style={delay(150)} className={`${h2} text-center`}>
          <Parts parts={mission.processH2} />
        </h2>
        <ol ref={stepsRef} data-reveal-stagger="" className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px] xl:grid-cols-4">
          {mission.steps.map((step, i) => (
            <li
              key={step.title}
              style={{ '--i': i } as CSSProperties}
              className="flex flex-col gap-[15px] rounded-[20px] bg-alternate p-[30px] md:p-10"
            >
              <span aria-hidden="true" className="font-heading text-h3 text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-h5 text-secondary uppercase">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="text-small">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
