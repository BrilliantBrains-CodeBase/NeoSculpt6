import { technology } from '../../data/home'
import { useReveal } from '../useReveal'

// Home technology banner: the supplied "Advanced Technology. Expert-Led Treatments." image, full width with no button,
// directly above Real Results (it replaced the 9-card Our Technology row on 2026-10-28 and moved here; the cards' data
// stays in data/home.ts for the technology pages). It sits flush on the Real Results band below.
// The banner image carries its own lettering. From tablet up it shows whole and the same words are a visually hidden
// H2 and line, so screen readers and search read them as text; on phones the lettering would be about 8px, so the
// picture switches to a devices-only crop and the H2 and line show as live text under it. The alt text describes the
// devices only, so nothing is read twice. Image sizes are set for both crops, so nothing shifts when they load.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function HomeTechnology() {
  const { banner } = technology
  const textRef = useReveal<HTMLDivElement>()

  return (
    <section id="technology-banner" aria-labelledby="technology-heading" className="bg-secondary">
      <picture>
        <source media="(min-width: 768px)" srcSet={banner.image.src} width={banner.image.width} height={banner.image.height} />
        <img
          src={banner.mobileImage.src}
          width={banner.mobileImage.width}
          height={banner.mobileImage.height}
          alt={banner.alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </picture>

      <div ref={textRef} data-reveal="up" className="flex flex-col items-center max-md:items-start gap-5 bg-background px-5 py-[50px] text-center max-md:text-left md:sr-only">
        <h2 id="technology-heading" className="font-heading text-h2 text-secondary uppercase">
          {banner.h2.map((line, i) => (
            <span key={i} className="block">
              {line.map((part) => (
                <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                  {part.text}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="max-w-[560px]">{banner.text}</p>
      </div>
    </section>
  )
}
