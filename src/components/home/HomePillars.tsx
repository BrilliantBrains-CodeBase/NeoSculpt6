import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { pillars } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowLeftIcon, ArrowRightIcon, FlowerIcon, TickIcon } from '../icons'

// Home section 4: Rejuvita "Core Treatment Pillars" (rejuvita-scrape/pages/home, container c2f9634 > highlight title
// b09a4a3 + cmsmasters-tabs 992a5e5; each tab is a saved section, 142/146/150, identical apart from the image).
// Styles from elementor/css/post-39758.css, post-142.css and cmsmasters-custom-widget-cmsmasters-tabs.min.css;
// behaviour from the addon's tabs.*.bundle.min.js.
// - Desktop: tab buttons sit under the panel (tabs-position-end) and switch it instantly (jQuery show/hide). The
//   theme fits 3 tabs in a row; our 6 don't fit, so the row scrolls sideways with arrows (agreed with the client).
// - <=1180: the widget becomes an accordion (tabs_responsive_choose). Each button heads its own panel, panels slide
//   (slideDown 400ms, slideUp "fast" 200ms), and the open one closes when clicked again (toggleSelf).
// All six panels are in the prerendered HTML (hidden with CSS), so their links stay crawlable.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

// Tab button (992a5e5): `alternate` fill that crossfades to `primary` on hover and when active.
const tabButton =
  'flex items-center gap-[15px] rounded-[7px] px-[30px] py-[18px] type-accent font-medium whitespace-nowrap uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background'
const tabState = (on: boolean) => (on ? 'bg-primary text-background' : 'bg-alternate text-secondary')

export function HomePillars() {
  // Open tab. Null only when the accordion's open item has been closed; desktop then shows the first tab.
  const [active, setActive] = useState<number | null>(0)
  const current = active ?? 0
  const titleRef = useReveal<HTMLHeadingElement>()
  const widgetRef = useReveal<HTMLDivElement>()

  // Desktop tab row: sideways scroll with arrows, shown only while the row overflows.
  const rowRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [canScroll, setCanScroll] = useState({ prev: false, next: false })
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const update = () =>
      setCanScroll({ prev: row.scrollLeft > 1, next: row.scrollLeft + row.clientWidth < row.scrollWidth - 1 })
    update()
    row.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(row)
    return () => {
      row.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])
  const overflows = canScroll.prev || canScroll.next

  // Scrolls the row (only the row, never the page) so tab i is fully in view.
  const revealTab = (i: number) => {
    const row = rowRef.current
    const tab = tabRefs.current[i]
    if (!row || !tab) return
    if (tab.offsetLeft < row.scrollLeft) row.scrollTo({ left: tab.offsetLeft, behavior: 'smooth' })
    else if (tab.offsetLeft + tab.offsetWidth > row.scrollLeft + row.clientWidth)
      row.scrollTo({ left: tab.offsetLeft + tab.offsetWidth - row.clientWidth, behavior: 'smooth' })
  }
  const selectTab = (i: number) => {
    setActive(i)
    revealTab(i)
  }
  const scrollRow = (dir: 1 | -1) => {
    const step = (tabRefs.current[0]?.offsetWidth ?? 300) + 5
    rowRef.current?.scrollBy({ left: dir * step, behavior: 'smooth' })
  }
  // Arrow keys, Home and End move between tabs and select them (WAI-ARIA tabs, automatic activation).
  const onTabKey = (e: KeyboardEvent) => {
    const last = pillars.tabs.length - 1
    const next = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current === 0 ? last : current - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    // preventScroll: focus's own jump would cancel revealTab's smooth scroll.
    tabRefs.current[next]?.focus({ preventScroll: true })
    selectTab(next)
  }

  return (
    <section
      id="specialities"
      aria-labelledby="specialities-heading"
      className="px-5 py-20 md:min-h-[1200px] md:px-[30px] md:py-[100px] xl:min-h-[1240px] xl:px-10 xl:py-[180px]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px] xl:gap-20">
        {/* Highlight title (b09a4a3) */}
        <h2
          id="specialities-heading"
          ref={titleRef}
          data-reveal="up"
          className="text-center font-heading text-h2 text-secondary uppercase"
        >
          {pillars.h2.map((part) => (
            <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
              {part.text}
            </span>
          ))}
        </h2>

        {/* Tabs widget (992a5e5): panels first, tab row under them on desktop. */}
        <div ref={widgetRef} data-reveal="up" style={delay(150)} className="flex flex-col gap-[5px] xl:gap-10">
          <div className="flex flex-col gap-[5px] xl:gap-0">
            {pillars.tabs.map((tab, i) => (
              <div key={tab.label} className="flex flex-col gap-[5px] xl:gap-0">
                {/* Accordion header, below desktop only. */}
                <button
                  type="button"
                  id={`pillar-header-${i}`}
                  aria-expanded={active === i}
                  aria-controls={`pillar-panel-${i}`}
                  onClick={() => setActive(active === i ? null : i)}
                  className={`${tabButton} ${tabState(active === i)} w-full text-left xl:hidden`}
                >
                  <FlowerIcon />
                  {tab.label}
                </button>
                <PillarPanel tab={tab} index={i} open={active === i} shownOnDesktop={current === i} />
              </div>
            ))}
          </div>

          {/* Desktop tab row */}
          <div className="hidden items-stretch gap-[5px] xl:flex">
            {overflows && (
              <ScrollArrow label="Previous specialities" disabled={!canScroll.prev} onClick={() => scrollRow(-1)}>
                <ArrowLeftIcon />
              </ScrollArrow>
            )}
            <div
              ref={rowRef}
              role="tablist"
              aria-label="Specialities"
              onKeyDown={onTabKey}
              className="relative mx-auto flex max-w-full min-w-0 snap-x gap-[5px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {pillars.tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`pillar-tab-${i}`}
                  aria-selected={current === i}
                  aria-controls={`pillar-panel-${i}`}
                  tabIndex={current === i ? 0 : -1}
                  onClick={() => selectTab(i)}
                  className={`${tabButton} ${tabState(current === i)} shrink-0 snap-start justify-center`}
                >
                  <FlowerIcon />
                  {tab.label}
                </button>
              ))}
            </div>
            {overflows && (
              <ScrollArrow label="More specialities" disabled={!canScroll.next} onClick={() => scrollRow(1)}>
                <ArrowRightIcon />
              </ScrollArrow>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ScrollArrow({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex shrink-0 items-center rounded-[7px] bg-alternate px-5 text-secondary transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

interface PanelProps {
  tab: (typeof pillars.tabs)[number]
  index: number
  open: boolean
  shownOnDesktop: boolean
}

// One saved section (142): content card overlapping the image by 120px on desktop, stacked above it below.
// Below desktop the wrapper is the accordion body: a 0fr/1fr grid row slides it open (400ms) and shut (200ms);
// visibility follows, so a closed panel's links leave the tab order once it has slid shut.
function PillarPanel({ tab, index, open, shownOnDesktop }: PanelProps) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLUListElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  return (
    <div
      id={`pillar-panel-${index}`}
      role="tabpanel"
      aria-labelledby={`pillar-tab-${index}`}
      className={`grid transition-[grid-template-rows,visibility] ease-in-out xl:grid-rows-[1fr] xl:transition-none ${
        open ? 'visible grid-rows-[1fr] duration-400' : 'invisible grid-rows-[0fr] duration-200'
      } ${shownOnDesktop ? 'xl:visible' : 'xl:hidden'}`}
    >
      <div className="min-h-0 overflow-hidden xl:overflow-visible">
        <div className="flex flex-col gap-[30px] py-2.5 md:py-5 xl:min-h-[640px] xl:flex-row xl:gap-0 xl:py-0">
          {/* Content card (468d4511) */}
          <div
            style={{ backgroundImage: 'url(/images/home/pillars-card-bg.webp)' }}
            className="relative z-[2] flex w-full flex-col items-start justify-center gap-10 rounded-[20px] bg-cover bg-center bg-no-repeat px-[30px] py-[60px] shadow-[0_10px_30px_0_rgba(0,0,0,0.1)] md:px-[60px] md:py-20 xl:my-[50px] xl:-mr-[120px] xl:w-1/2 xl:p-20"
          >
            <h3 ref={titleRef} data-reveal="up" style={delay(50)} className="font-heading text-h3 text-secondary uppercase">
              {tab.title}
            </h3>
            <p ref={textRef} data-reveal="up" style={delay(100)}>
              {tab.text}
            </p>
            {/* Icon list (71ea3a40): 2 columns from tablet up, tertiary ticks, primary on hover. */}
            <ul
              ref={listRef}
              data-reveal="up"
              style={delay(150)}
              className="grid w-full grid-cols-1 gap-x-5 gap-y-[7.5px] md:mb-2.5 md:grid-cols-2 xl:mb-5"
            >
              {tab.items.map((item) => (
                <li key={item.href}>
                  <SmartLink
                    href={item.href}
                    className="group flex items-center gap-3 text-text transition-colors duration-300 hover:text-primary focus-visible:text-primary"
                  >
                    <TickIcon className="size-5 shrink-0 text-tertiary transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary" />
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
            {/* Button (12d5cd46): outlined in `secondary`, fills with `primary` on hover. */}
            <div ref={buttonRef} data-reveal="pop" style={delay(200)}>
              <SmartLink
                href={tab.cta.href}
                className="inline-block rounded-[7px] border border-secondary px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-alternate focus-visible:border-primary focus-visible:bg-primary focus-visible:text-alternate"
              >
                {tab.cta.label}
              </SmartLink>
            </div>
          </div>

          {/* Image box (9327a78) */}
          <div className="relative min-h-[250px] w-full overflow-hidden rounded-[20px] md:min-h-[520px] xl:min-h-0 xl:w-[60%]">
            <img
              src={tab.image}
              width={1024}
              height={1024}
              alt={tab.imageAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
