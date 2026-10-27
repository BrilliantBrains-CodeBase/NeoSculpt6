import { useEffect, useRef, useState } from 'react'
import { visit, details } from '../../data/contact'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ClinicFacts } from './ClinicFacts'
import { MapPinIcon } from '../icons'
import { Parts, button, delay, lightButton } from '../shared'

// Contact section 3: visit us / map (homepage.md section F: map on the left with the theme's card radius, address card
// on the right; stacked, map first, below xl). The map is click-to-load: the prerendered page and first visit make no
// request to Google, and the keyless embed (clinic.mapEmbedSrc) is only added after the visitor clicks "Show Map".
// "Get Directions" always works, map shown or not. No travel-time or parking claims.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ContactVisit() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const mapRef = useReveal<HTMLDivElement>()
  const cardRef = useReveal<HTMLDivElement>()
  const [showMap, setShowMap] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // The button is replaced by the map, so move focus to the map rather than losing it to the page.
  useEffect(() => {
    if (showMap) iframeRef.current?.focus()
  }, [showMap])

  return (
    <section
      id="visit-us"
      aria-labelledby="visit-us-heading"
      className="mx-auto flex max-w-site flex-col gap-[50px] px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]"
    >
      <h2 id="visit-us-heading" ref={titleRef} data-reveal="up" className="text-center font-heading text-h2 text-secondary uppercase text-balance">
        <Parts parts={visit.h2} />
      </h2>

      <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-[1fr_440px]">
        {/* Map panel */}
        <div
          ref={mapRef}
          data-reveal="up"
          className="relative min-h-[360px] overflow-hidden rounded-[20px] border border-border bg-alternate md:min-h-[460px]"
        >
          {showMap ? (
            <iframe
              ref={iframeRef}
              src={clinic.mapEmbedSrc}
              title={visit.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-[30px] text-center">
              <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-border text-primary">
                <MapPinIcon className="size-7 shrink-0" />
              </span>
              <p className="max-w-[420px] text-small text-text">{visit.mapText}</p>
              <button type="button" onClick={() => setShowMap(true)} className={lightButton}>
                {visit.showMap}
              </button>
            </div>
          )}
        </div>

        {/* Address card */}
        <div
          ref={cardRef}
          data-reveal="up"
          style={delay(150)}
          className="flex min-w-0 flex-col gap-[30px] rounded-[20px] bg-alternate px-5 py-10 md:p-[50px] xl:p-10"
        >
          <ClinicFacts show={['address', 'landmark', 'hours', 'phone']} />
          <p className="border-t border-border pt-[25px] text-small text-text">{clinic.nearbyAreas}</p>
          <SmartLink href={clinic.mapsHref} className={`${button} w-full`}>
            {details.actions.directions}
            <span className="sr-only"> to {clinic.name} on Google Maps (opens in a new tab)</span>
          </SmartLink>
        </div>
      </div>
    </section>
  )
}
