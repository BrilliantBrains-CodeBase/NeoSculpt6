import type { PhotoView } from '../../data/assessment'

// Line drawings of the head for each photo step of the hair assessment: which part of the scalp the photo should
// show, with that area in the theme's gold. Drawn here (no patient photos), stroke in currentColor.

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const area = 'fill-tertiary/35 stroke-tertiary'

function Front() {
  return (
    <>
      <path d="M26 60c0-22 15-36 34-36s34 14 34 36v8c0 24-15 42-34 42S26 92 26 68z" {...line} />
      <path className={area} strokeWidth={2} d="M26 62c0-24 15-38 34-38s34 14 34 38c-8-12-20-18-34-18S34 50 26 62z" />
      <path d="M20 66c-4 0-5 10 2 12M100 66c4 0 5 10-2 12" {...line} />
      <path d="M44 70h8M68 70h8M60 74v10M54 92c4 3 8 3 12 0" {...line} />
    </>
  )
}

function Top({ parting = false }: { parting?: boolean }) {
  return (
    <>
      <ellipse cx="60" cy="62" rx="36" ry="42" {...line} />
      <path d="M24 60c-5 0-6 10 0 12M96 60c5 0 6 10 0 12M54 104l6 8 6-8" {...line} />
      {parting ? (
        <>
          <path className={area} strokeWidth={2} d="M32 38c8-12 18-18 28-18s20 6 28 18c-6 18-16 34-28 42-12-8-22-24-28-42z" />
          <path d="M60 20v62" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle className={area} strokeWidth={2} cx="60" cy="54" r="22" />
          <path d="M60 54c4 0 6-3 5-6-1-4-6-5-9-2-4 4-2 11 4 12 7 1 12-5 10-12" {...line} />
        </>
      )}
    </>
  )
}

function Back() {
  return (
    <>
      <path d="M26 58c0-22 15-36 34-36s34 14 34 36v14c0 16-12 28-22 30v10H48v-10c-10-2-22-14-22-30z" {...line} />
      <path className={area} strokeWidth={2} d="M30 66c8 8 18 12 30 12s22-4 30-12v10c-8 8-18 12-30 12s-22-4-30-12z" />
      <path d="M20 60c-4 0-5 10 2 12M100 60c4 0 5 10-2 12" {...line} />
    </>
  )
}

export function PhotoGuide({ view, className = '' }: { view: PhotoView; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className={`text-secondary ${className}`}>
      {view === 'front' ? <Front /> : view === 'back' ? <Back /> : <Top parting={view === 'parting'} />}
    </svg>
  )
}
