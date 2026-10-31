import { resultCategories, type ResultCase } from '../../data/results'

// One /results/ gallery card: the case's before and after thumbnails side by side (each tagged, both with their own
// alt text, so the card describes the case without the lightbox), then the category and any approved details
// (treatment name, timeline, doctor, caption: shown only when set). A button over the photos opens the comparison.
// `eager` loads the first card's photos straight away.

const tag = 'absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] tracking-[2px] text-secondary uppercase'

export function ResultCaseCard({ c, position, eager, onOpen }: { c: ResultCase; position: string; eager: boolean; onOpen: () => void }) {
  const category = resultCategories[c.category]
  const details = [c.treatmentName, c.timeline, c.doctor].filter(Boolean).join(' · ')

  return (
    <article className="flex flex-col gap-[15px]">
      <figure className="group relative grid grid-cols-2 gap-1 overflow-hidden rounded-[20px] border border-border bg-alternate">
        {(['before', 'after'] as const).map((side) => {
          const img = c[side]
          return (
            <div key={side} className="relative overflow-hidden">
              <img
                src={img.thumbnail}
                srcSet={`${img.thumbnail} ${img.width / 2}w, ${img.src} ${img.width}w`}
                sizes="(min-width: 1181px) 224px, (min-width: 768px) 25vw, 50vw"
                width={img.width}
                height={img.height}
                alt={img.alt}
                loading={eager ? undefined : 'lazy'}
                decoding="async"
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span aria-hidden="true" className={tag}>
                {side}
              </span>
            </div>
          )
        })}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Compare before and after: ${category.label}, ${position}`}
          className="absolute inset-0 rounded-[20px] outline-offset-4 outline-secondary focus-visible:outline-2"
        />
      </figure>
      <div className="flex flex-col gap-1">
        <p className="text-meta tracking-[2px] text-tertiary uppercase">{c.treatmentLabel}</p>
        {details && <p className="text-small text-secondary">{details}</p>}
        {c.caption && <p className="text-small">{c.caption}</p>}
      </div>
    </article>
  )
}
