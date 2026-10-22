import { useId, useState } from 'react'

// The theme's cmsmasters-toggles (rejuvita-scrape/pages/services__rhinoplasty "How it Works" 0dfaad1 and the "Quick
// answers" card 3632c3e8; also the About FAQs): a title row with a thin plus that turns into a minus, the open title
// in gold (the theme's active-toggle colour), a 1px border under each item.
// Renders the items only; the caller wraps them (and adds the top border and any reveal).
// Every answer is in the prerendered HTML: a closed panel collapses (grid rows 0fr, then visibility hidden so it leaves
// the tab order and the accessibility tree) but is never unmounted. Disclosure pattern: a button inside each title
// heading with aria-expanded and aria-controls; the panel is a region labelled by its button. Enter and Space work
// because the trigger is a real <button>. No animation with reduced motion.

export interface AccordionItem {
  title: string
  body: string
}

interface Props {
  items: AccordionItem[]
  /** Indexes open on first render (the theme opens the first item). */
  defaultOpen?: number[]
  /** Heading level of each title, under the section's H2. */
  headingLevel?: 'h3' | 'h4'
}

export function Accordion({ items, defaultOpen = [0], headingLevel: Heading = 'h3' }: Props) {
  const uid = useId()
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen))

  const toggle = (i: number) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        const buttonId = `${uid}-q${i}`
        const panelId = `${uid}-a${i}`
        return (
          <div key={item.title} className="border-b border-border">
            <Heading>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={`flex w-full items-center justify-between gap-5 py-5 text-left font-heading text-h5 uppercase transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2 ${
                  isOpen ? 'text-tertiary' : 'text-secondary'
                }`}
              >
                {item.title}
                {/* Plus / minus: the vertical bar folds away when the item is open. */}
                <span aria-hidden="true" className="relative size-3.5 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'scale-y-0' : ''}`}
                  />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none ${
                isOpen ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pr-5 pb-[25px] md:pr-[60px]">{item.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
