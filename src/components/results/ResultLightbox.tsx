import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
import { resultCategories, type ResultCase } from '../../data/results'
import { useModal } from '../useModal'
import { usePresence } from '../usePresence'
import { SmartLink } from '../SmartLink'
import { BeforeAfter } from '../BeforeAfter'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../icons'

// /results/ comparison view: one case in the shared before/after slider (BeforeAfter: drag, click, keyboard, no
// automatic nudge, Before / After tags), with previous / next through the cases the filter shows. Built like the
// booking popup (useModal: scroll lock, focus trap, Escape and the close button close it, focus goes back to the card
// that opened it); rendered only while open, so the prerendered page holds no extra images.
// ← / → step between cases, except on the slider's handle, where they move the divider. No swipe to step: a sideways
// drag on the photo belongs to the slider. The case line under the photo is a live region, so a step is announced.
// Only the neighbouring cases' images are loaded ahead.

const navButton =
  'flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-background transition-colors duration-300 hover:bg-primary focus-visible:bg-primary'

export function ResultLightbox({ cases, index, onIndex }: { cases: ResultCase[]; index: number | null; onIndex: (i: number | null) => void }) {
  const isOpen = index !== null
  const { mounted, shown } = usePresence(isOpen, 300)
  const close = () => onIndex(null)
  const ref = useModal<HTMLDivElement>(isOpen && mounted, close)
  const titleId = useId()
  // Keep showing the last case while the panel fades out.
  const last = useRef(0)
  if (index !== null) last.current = index

  useEffect(() => {
    if (index === null || cases.length < 2) return
    for (const d of [1, -1]) {
      const n = cases[(index + d + cases.length) % cases.length]
      for (const img of [n.before, n.after]) new Image().src = img.src
    }
  }, [index, cases])

  if (!mounted || !cases.length) return null

  const i = Math.min(last.current, cases.length - 1)
  const c = cases[i]
  const category = resultCategories[c.category]
  const details = [c.treatmentName, c.timeline, c.doctor].filter(Boolean).join(' · ')
  const step = (d: number) => onIndex((i + d + cases.length) % cases.length)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) return // the slider's handle used the key
    if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'ArrowRight') step(1)
    else return
    e.preventDefault()
  }

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-5 backdrop-blur-[2px] transition-opacity duration-300 md:p-10 ${shown ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        // The photos are 432×800: as tall as the screen allows under the controls, never wider than the screen.
        style={{ width: 'min(100%, calc((100dvh - 190px) * 0.54))' }}
        className={`relative flex flex-col gap-[15px] outline-none transition-transform duration-300 ${shown ? 'scale-100' : 'scale-95'}`}
      >
        <BeforeAfter
          key={c.id}
          before={c.before}
          after={c.after}
          defaultOffset={50}
          nudge={false}
          labels
          eager
          label={`Before and after: ${category.label}`}
        />
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => step(-1)} aria-label="Previous case" className={navButton}>
            <ArrowLeftIcon />
          </button>
          <div className="flex min-w-0 flex-col items-center gap-1 text-center">
            <p id={titleId} aria-live="polite" className="text-meta tracking-[2px] text-tertiary uppercase">
              {c.treatmentLabel} · {i + 1} / {cases.length}
            </p>
            {details && <p className="text-small text-secondary">{details}</p>}
            {c.caption && <p className="text-small">{c.caption}</p>}
            <SmartLink
              href={category.href}
              className="text-small text-secondary underline-offset-4 hover:text-primary hover:underline focus-visible:text-primary"
            >
              Explore {category.label}
            </SmartLink>
          </div>
          <button type="button" onClick={() => step(1)} aria-label="Next case" className={navButton}>
            <ArrowRightIcon />
          </button>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          data-autofocus
          className="absolute -top-2 -right-2 z-20 flex size-10 items-center justify-center rounded-full bg-secondary text-background transition-colors duration-300 hover:bg-primary focus-visible:bg-primary md:-top-4 md:-right-4"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
