import { useState } from 'react'
import { resultCases, resultCategories, resultsPage as copy, type ResultCategory } from '../../data/results'
import { useReveal } from '../useReveal'
import { Parts, delay, h2 } from '../shared'
import { ResultCaseCard } from './ResultCaseCard'
import { ResultLightbox } from './ResultLightbox'

// /results/ sections 3–5: filters, the before/after gallery, and the privacy and medical notes (results-page.md §3–7).
// Cases come from src/data/results.ts, which shows only published, consented, approved cases; this file renders
// whatever it gets, so adding a case is data and images only.
// - Filters: All plus one button per category that has cases (pillars tab style: `alternate` fill, `primary` when
//   pressed), each with its count. A live line under them says how many cases show. Changing the filter closes the
//   comparison; the buttons stay put, so focus stays on the one pressed.
// - Grid: 1 / 2 / 3 columns. Every case is in the prerendered HTML; a filter only hides the others.
// - A card opens ResultLightbox on the cases the filter shows.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

type Filter = 'all' | ResultCategory

const filterButton =
  'rounded-[7px] px-5 py-3 type-accent font-medium uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background md:px-[30px] md:py-[18px]'
const filterState = (on: boolean) => (on ? 'bg-primary text-background' : 'bg-alternate text-secondary')

export function ResultsGallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<number | null>(null) // index into `visible`
  const visible = filter === 'all' ? resultCases : resultCases.filter((c) => c.category === filter)
  const titleRef = useReveal<HTMLHeadingElement>()
  const filtersRef = useReveal<HTMLDivElement>()
  const gridRef = useReveal<HTMLUListElement>()
  const notesRef = useReveal<HTMLElement>()

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: copy.allLabel, count: resultCases.length },
    ...(Object.keys(resultCategories) as ResultCategory[])
      .map((id) => ({ id, label: resultCategories[id].label, count: resultCases.filter((c) => c.category === id).length }))
      .filter((f) => f.count > 0),
  ]
  const choose = (f: Filter) => {
    setOpen(null)
    setFilter(f)
  }
  const current = filters.find((f) => f.id === filter) ?? filters[0]

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px]">
        <h2 id="gallery-heading" ref={titleRef} data-reveal="up" className={`${h2} text-center max-md:text-left`}>
          <Parts parts={copy.galleryTitle} />
        </h2>

        {resultCases.length === 0 ? (
          <p className="text-center max-md:text-left">{copy.empty}</p>
        ) : (
          <>
            <div ref={filtersRef} data-reveal="up" style={delay(150)} className="flex flex-col items-center gap-5 max-md:items-start">
              {filters.length > 2 && (
                <div role="group" aria-label="Filter results by speciality" className="flex flex-wrap justify-center gap-2.5 max-md:justify-start md:gap-[15px]">
                  {filters.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={filter === f.id}
                      onClick={() => choose(f.id)}
                      className={`${filterButton} ${filterState(filter === f.id)}`}
                    >
                      {f.label} <span className="opacity-60">({f.count})</span>
                    </button>
                  ))}
                </div>
              )}
              <p aria-live="polite" className="text-small text-text/70">
                Showing {visible.length} {visible.length === 1 ? 'case' : 'cases'}
                {filter === 'all' ? '' : `: ${current.label}`}
              </p>
            </div>

            <ul ref={gridRef} data-reveal="up" style={delay(300)} className="grid grid-cols-1 gap-x-[30px] gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {resultCases.map((c, n) => {
                const shown = visible.indexOf(c)
                return (
                  <li key={c.id} hidden={shown < 0}>
                    <ResultCaseCard
                      c={c}
                      position={`case ${shown + 1} of ${visible.length}`}
                      eager={n === 0}
                      onOpen={() => setOpen(shown)}
                    />
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {/* Privacy and medical notes (§7) */}
        <aside
          ref={notesRef}
          data-reveal="up"
          aria-label="Privacy and medical notes"
          className="mx-auto flex max-w-[860px] flex-col gap-1 rounded-[20px] border border-border px-5 py-5 text-center text-small text-text max-md:text-left md:px-10"
        >
          <p>{copy.privacy}</p>
          <p>{copy.disclaimer}</p>
        </aside>
      </div>

      <ResultLightbox cases={visible} index={open} onIndex={setOpen} />
    </section>
  )
}
