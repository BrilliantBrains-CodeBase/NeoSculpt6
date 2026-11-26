import { useEffect, useRef, useState } from 'react'
import {
  journalHub,
  publicRecords,
  SPECIALITY_KEYS,
  specialities,
  TYPES,
  typeFilterLabels,
  type EditorialType,
  type SpecialityKey,
} from '../../data/editorial'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { button, delay, h2, lightButton } from '../shared'
import { EditorialCard, focusRing } from './EditorialCard'

// Journal hub sections 2–6: the editorial statement, the filters, the featured (newest) item, the card grid and
// "Show more". Cards come from src/data/editorial.ts (`publicRecords`, newest first); nothing is listed here by hand.
// The prerendered HTML is the "All" view with every public item, so crawlers see all of them whatever a visitor
// filters. After the page loads, ?type= and ?speciality= in the URL set the filters, and changing a filter writes
// them back (replaceState), so a filtered view can be shared or reloaded. Changing a filter resets "Show more" and the
// result count is announced in a status line; focus stays on the control that was used. "Show more" moves focus to
// the first new card.
// The grid is the theme's blog page (rejuvita-scrape/pages/blog-page): 3 columns on desktop, 1 below, cards as rows
// on tablet. Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

type TypeFilter = 'all' | EditorialType
type SpecialityFilter = 'all' | SpecialityKey

const isType = (v: string | null): v is EditorialType => !!v && (TYPES as readonly string[]).includes(v)
const isSpeciality = (v: string | null): v is SpecialityKey => !!v && (SPECIALITY_KEYS as string[]).includes(v)

const PAGE = journalHub.pageSize

export function JournalIntro() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  return (
    <section
      id="journal-intro"
      aria-labelledby="journal-intro-heading"
      className="mx-auto flex max-w-[960px] flex-col items-center gap-5 px-5 pt-20 text-center max-md:items-start max-md:text-left md:px-[30px] md:pt-[100px] xl:px-10 xl:pt-[150px]"
    >
      <h2 id="journal-intro-heading" ref={titleRef} data-reveal="up" className={h2}>
        {journalHub.intro.h2}
      </h2>
      <p ref={textRef} data-reveal="up" style={delay(150)}>
        {journalHub.intro.text}
      </p>
    </section>
  )
}

export function JournalListing() {
  const { open } = useBooking()
  const filtersRef = useReveal<HTMLElement>()
  const listRef = useRef<HTMLUListElement>(null)
  const focusIndex = useRef<number | null>(null)

  const [type, setType] = useState<TypeFilter>('all')
  const [speciality, setSpeciality] = useState<SpecialityFilter>('all')
  const [visible, setVisible] = useState(PAGE)

  // Filters from the URL, once the page has loaded (the prerendered page is always "All").
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('type')
    const s = params.get('speciality')
    if (isType(t)) setType(t)
    if (isSpeciality(s)) setSpeciality(s)
  }, [])

  const update = (next: { type?: TypeFilter; speciality?: SpecialityFilter }) => {
    const t = next.type ?? type
    const s = next.speciality ?? speciality
    setType(t)
    setSpeciality(s)
    setVisible(PAGE)
    const url = new URL(window.location.href)
    if (t === 'all') url.searchParams.delete('type')
    else url.searchParams.set('type', t)
    if (s === 'all') url.searchParams.delete('speciality')
    else url.searchParams.set('speciality', s)
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }

  const bySpeciality = publicRecords.filter((r) => speciality === 'all' || r.speciality === speciality)
  const results = bySpeciality.filter((r) => type === 'all' || r.type === type)
  const [featured, ...rest] = results
  const shownRest = rest.slice(0, visible)
  const shown = featured ? 1 + shownRest.length : 0
  const countFor = (t: TypeFilter) => (t === 'all' ? bySpeciality.length : bySpeciality.filter((r) => r.type === t).length)
  const heading = type === 'all' ? 'All Insights' : typeFilterLabels[type]
  const status =
    results.length === 0
      ? `No ${type === 'all' ? 'items' : typeFilterLabels[type].toLowerCase()} yet${speciality === 'all' ? '' : ` in ${specialities[speciality].label}`}`
      : `Showing ${shown} of ${results.length} ${results.length === 1 ? 'item' : 'items'} · newest first`
  const showsMedia = results.some((r) => r.type === 'media')

  // After "Show more", focus the first card that was just added.
  useEffect(() => {
    if (focusIndex.current === null) return
    const item = listRef.current?.children[focusIndex.current] as HTMLElement | undefined
    item?.querySelector<HTMLAnchorElement>('a')?.focus()
    focusIndex.current = null
  }, [visible])

  return (
    <section
      id="journal-listing"
      aria-labelledby="journal-results-heading"
      className="mx-auto flex w-full max-w-[1480px] flex-col gap-10 px-5 py-20 md:gap-[60px] md:px-[30px] md:py-[100px] xl:px-10 xl:py-[120px]"
    >
      {/* Filters */}
      <nav ref={filtersRef} data-reveal="up" aria-label="Filter the journal" className="flex flex-col gap-5 border-y border-border py-6 xl:flex-row xl:items-center xl:justify-between">
        <ul className="flex flex-wrap gap-2.5" aria-label="Content type">
          {(['all', ...TYPES] as TypeFilter[]).map((t) => {
            const active = t === type
            return (
              <li key={t}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ type: t })}
                  className={`min-h-11 rounded-full border px-5 py-2 text-button font-semibold uppercase transition-colors duration-300 ${focusRing} ${
                    active
                      ? 'border-primary bg-primary text-background'
                      : 'border-border text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {t === 'all' ? 'All' : typeFilterLabels[t]}
                  <span className="ml-2 opacity-70">{countFor(t)}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <label className="flex flex-col gap-2 text-meta text-text md:flex-row md:items-center md:gap-4">
          <span>Speciality</span>
          <select
            value={speciality}
            onChange={(e) => update({ speciality: e.target.value as SpecialityFilter })}
            className={`min-h-11 w-full rounded-[7px] border border-border bg-alternate px-4 py-2 text-small text-secondary md:w-[280px] ${focusRing}`}
          >
            <option value="all">All specialities</option>
            {SPECIALITY_KEYS.map((key) => (
              <option key={key} value={key}>
                {specialities[key].label}
              </option>
            ))}
          </select>
        </label>
      </nav>

      <div className="flex flex-col gap-3">
        <h2 id="journal-results-heading" className="font-heading text-h3 text-secondary uppercase">
          {heading}
        </h2>
        <p role="status" className="text-meta text-text">
          {status}
        </p>
        {showsMedia && <p className="max-w-[860px] text-meta text-text/80">{journalHub.mediaNote}</p>}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-start gap-6 rounded-[20px] border border-border bg-alternate p-8 md:p-12">
          <p className="max-w-[640px] text-secondary">{journalHub.empty}</p>
          <div className="flex flex-wrap gap-x-[25px] gap-y-[15px]">
            <button type="button" onClick={open} className={button}>
              Book a Consultation
            </button>
            <SmartLink href="/#specialities" className={lightButton}>
              Explore Specialities
            </SmartLink>
          </div>
        </div>
      ) : (
        <>
          {/* Featured: the newest item in the current view. */}
          <EditorialCard record={featured} variant="featured" />

          {shownRest.length > 0 && (
            <ul ref={listRef} className="grid grid-cols-1 gap-10 xl:grid-cols-3">
              {shownRest.map((r) => (
                <li key={r.id} className="min-w-0">
                  <EditorialCard record={r} />
                </li>
              ))}
            </ul>
          )}

          {rest.length > visible && (
            <div className="flex justify-center max-md:justify-start">
              <button
                type="button"
                onClick={() => {
                  focusIndex.current = visible
                  setVisible((v) => v + PAGE)
                }}
                className={button}
              >
                Show More
                <span className="sr-only"> ({rest.length - visible} more)</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
