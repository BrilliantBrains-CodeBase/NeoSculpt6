import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { CompareArrowsIcon } from './icons'

// Rejuvita before/after slider (cmsmasters-before-after, home b74fcc6; styles from
// widget-cmsmasters-before-after.min.css and elementor/css/post-39758.css, behaviour from the addon's
// before-after.*.bundle.min.js with move: click, handle and imitation_handle on).
// - The before image sets the size; the after image sits on top, clipped to the part right of the handle.
// - A click or tap jumps the handle there; a sideways drag moves it. A vertical swipe still scrolls the page
//   (touch-action: pan-y), as with the theme's move.js, which only starts a drag on sideways movement.
// - Every 6s, unless it is being dragged, the handle nudges right and left (`imitationHandle()`; keyframes in
//   src/styles/index.css). The clip stays put.
// The position is a percentage, so the prerendered HTML already shows the default split.
// Not in the theme: the handle is a keyboard slider (arrows move 5%, Home/End go to the ends).
// Options for other pages (the /results/ lightbox): `nudge={false}` turns the 6s nudge off (no automatic movement),
// `labels` adds small Before / After tags in the bottom corners (each fades out as the divider covers it), `eager` loads
// the images straight away, `label` names the slider for screen readers, and `aspect` (width / height) crops both
// images to that shape the same way (object-fit: cover, centred), so a matched pair stays matched.

interface Image {
  src: string
  width: number
  height: number
  alt: string
}

interface Props {
  before: Image
  after: Image
  defaultOffset: number // %
  className?: string
  nudge?: boolean
  labels?: boolean
  eager?: boolean
  label?: string
  aspect?: number
}

const DRAG_THRESHOLD = 5 // px of sideways movement before a press becomes a drag
const clamp = (n: number) => Math.min(100, Math.max(0, n))
const tag =
  'pointer-events-none absolute bottom-4 z-[5] rounded-full bg-black/60 px-3 py-1 text-meta tracking-[2px] text-secondary uppercase transition-opacity duration-200'

export function BeforeAfter({
  before,
  after,
  defaultOffset,
  className = '',
  nudge = true,
  labels = false,
  eager = false,
  label = 'Before and after comparison',
  aspect,
}: Props) {
  const [offset, setOffset] = useState(defaultOffset)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // The press in progress: where it started and whether it has turned into a drag.
  const press = useRef<{ id: number; x: number; drag: boolean } | null>(null)

  const moveTo = (clientX: number) => {
    const box = containerRef.current?.getBoundingClientRect()
    if (box?.width) setOffset(clamp(((clientX - box.left) / box.width) * 100))
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    press.current = { id: e.pointerId, x: e.clientX, drag: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    if (!p.drag) {
      if (Math.abs(e.clientX - p.x) < DRAG_THRESHOLD) return
      p.drag = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    moveTo(e.clientX)
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    if (!p.drag) moveTo(e.clientX) // a click
    press.current = null
    setDragging(false)
  }
  // The browser took the gesture over (a vertical scroll): leave the handle where it is.
  const onPointerCancel = () => {
    press.current = null
    setDragging(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown'
        ? offset - 5
        : e.key === 'ArrowRight' || e.key === 'ArrowUp'
          ? offset + 5
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? 100
              : null
    if (next === null) return
    e.preventDefault()
    setOffset(clamp(next))
  }

  return (
    <div
      ref={containerRef}
      data-active={dragging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      style={aspect ? { aspectRatio: aspect } : undefined}
      className={`relative flex touch-pan-y overflow-hidden rounded-[20px] select-none ${className}`}
    >
      <img
        src={before.src}
        width={before.width}
        height={before.height}
        alt={before.alt}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        draggable={false}
        className={aspect ? 'block size-full object-cover' : 'block h-auto w-full'}
      />
      <img
        src={after.src}
        width={after.width}
        height={after.height}
        alt={after.alt}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        draggable={false}
        style={{ clipPath: `inset(0 0 0 ${offset}%)` }}
        className="absolute inset-0 size-full object-cover"
      />

      {labels && (
        <>
          <span aria-hidden="true" style={{ opacity: offset < 20 ? 0 : 1 }} className={tag + ' left-4'}>
            Before
          </span>
          <span aria-hidden="true" style={{ opacity: offset > 80 ? 0 : 1 }} className={tag + ' right-4'}>
            After
          </span>
        </>
      )}

      {/* Handle: 43px `secondary` circle with `primary` chevrons, and 3px lines running up and down from its edge. */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(offset)}
        aria-valuetext={`${Math.round(offset)}% before, ${100 - Math.round(offset)}% after`}
        onKeyDown={onKeyDown}
        style={{ left: `${offset}%` }}
        className={`${nudge ? 'before-after-handle ' : ''}absolute top-1/2 z-10 flex size-[43px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-primary shadow-[0_0_5px_rgba(0,0,0,0.2)] outline-offset-4 outline-secondary focus-visible:outline-2`}
      >
        <span aria-hidden="true" className="absolute bottom-full left-1/2 h-[9999px] w-[3px] -translate-x-1/2 bg-secondary shadow-[0_0_5px_rgba(0,0,0,0.2)]" />
        <span aria-hidden="true" className="absolute top-full left-1/2 h-[9999px] w-[3px] -translate-x-1/2 bg-secondary shadow-[0_0_5px_rgba(0,0,0,0.2)]" />
        <CompareArrowsIcon />
      </div>
    </div>
  )
}
