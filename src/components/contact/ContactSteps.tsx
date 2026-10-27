import type { CSSProperties } from 'react'
import { steps } from '../../data/contact'
import { useReveal } from '../useReveal'
import { Parts } from '../shared'

// Contact section 5: what happens after you contact us. Four numbered cards (01–04 in the theme's gold, as the service
// pages number their process steps) on `alternate` with the theme's card radius. Process only: no response-time
// promise beyond the form's "within working hours".
// Breakpoints are the theme's: base = mobile (<=767, 1 per row), md = tablet (2), xl = desktop (4).

export function ContactSteps() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const listRef = useReveal<HTMLOListElement>()

  return (
    <section
      id="contact-next-steps"
      aria-labelledby="contact-next-steps-heading"
      className="mx-auto flex max-w-site flex-col gap-[50px] px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[120px]"
    >
      <h2
        id="contact-next-steps-heading"
        ref={titleRef}
        data-reveal="up"
        className="text-center font-heading text-h3 text-secondary uppercase text-balance"
      >
        <Parts parts={steps.h2} />
      </h2>
      <ol ref={listRef} data-reveal-stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-[30px]">
        {steps.items.map((step, i) => (
          <li
            key={step.title}
            style={{ '--i': i } as CSSProperties}
            className="flex flex-col gap-[15px] rounded-[20px] border border-border bg-alternate p-[30px] xl:p-10"
          >
            <span aria-hidden="true" className="font-heading text-h3 text-tertiary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-h5 text-secondary uppercase">{step.title}</h3>
            <p className="text-small text-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
