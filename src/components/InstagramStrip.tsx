import type { CSSProperties, ReactNode } from 'react'
import { instagram } from '../data/site'
import { useReveal } from './useReveal'
import { SmartLink } from './SmartLink'
import { Pending } from './home/HomeTestimonials'

// Rejuvita Instagram row above the footer (rejuvita-scrape/pages/about-us and services__rhinoplasty: "Instagram
// @handle" label, then six square photos edge to edge). Used by the About page (section 7) and every service page.
// No feed integration exists, so the tiles are a curated set (data/site.ts), never the theme's model photos. The
// handle is a pending chip and the tiles are not links until the profile URL is confirmed.
// Breakpoints are the theme's: base = mobile (<=767, 2 per row), md = tablet (3), xl = desktop (6).

// Renders nothing while the site-wide switch (instagram.enabled in data/site.ts) is off.
export function InstagramStrip() {
  return instagram.enabled ? <InstagramStripContent /> : null
}

function InstagramStripContent() {
  const labelRef = useReveal<HTMLHeadingElement>()
  const gridRef = useReveal<HTMLUListElement>()

  return (
    <section id="instagram" aria-labelledby="instagram-heading" className="flex flex-col gap-5">
      <h2
        id="instagram-heading"
        ref={labelRef}
        data-reveal="right"
        className="px-5 text-h6 font-medium text-primary uppercase md:px-[30px]"
      >
        Instagram @
        {instagram.handle && instagram.href ? (
          <SmartLink href={instagram.href} className="transition-colors duration-300 hover:text-tertiary focus-visible:text-tertiary">
            {instagram.handle}
            <span className="sr-only"> (opens in a new tab)</span>
          </SmartLink>
        ) : (
          <Pending value={instagram.handle} placeholder="NeoSculpt6 handle — confirm" />
        )}
      </h2>

      <ul ref={gridRef} data-reveal-stagger="" style={{ '--reveal-stagger': '100ms' } as CSSProperties} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {instagram.tiles.map((tile, i) => {
          const href = tile.href ?? instagram.href
          const image: ReactNode = (
            <img
              src={tile.src}
              width={tile.width}
              height={tile.height}
              alt={tile.alt}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
          )
          return (
            <li key={tile.src} style={{ '--i': i } as CSSProperties} className="group overflow-hidden">
              {href ? (
                <SmartLink href={href} className="block outline-offset-[-4px] outline-tertiary focus-visible:outline-2">
                  {image}
                  <span className="sr-only"> (opens Instagram in a new tab)</span>
                </SmartLink>
              ) : (
                image
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
