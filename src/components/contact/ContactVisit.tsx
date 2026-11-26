import { actions, visit } from '../../data/contact'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ClinicFacts } from './ClinicFacts'
import { Parts, button, delay } from '../shared'

// Contact section 3: visit us / map (homepage.md section F: map on the left with the theme's card radius, address card
// on the right; stacked, map first, below xl). The map shows by default: Google's keyless embed (clinic.mapEmbedSrc),
// lazy-loaded so it is fetched only as it nears the screen. The card holds what the form sidebar does not: the
// landmark, the nearby-areas line and "Get Directions". No travel-time or parking claims.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ContactVisit() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const mapRef = useReveal<HTMLDivElement>()
  const cardRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="visit-us"
      aria-labelledby="visit-us-heading"
      className="mx-auto flex max-w-site flex-col gap-[50px] px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]"
    >
      <h2
        id="visit-us-heading"
        ref={titleRef}
        data-reveal="up"
        className="text-center font-heading text-h2 text-balance text-secondary uppercase max-md:text-left"
      >
        <Parts parts={visit.h2} />
      </h2>

      <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-[1fr_380px]">
        {/* Map */}
        <div
          ref={mapRef}
          data-reveal="up"
          className="relative min-h-[360px] overflow-hidden rounded-[20px] border border-border bg-alternate md:min-h-[460px]"
        >
          <iframe
            src={clinic.mapEmbedSrc}
            title={visit.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0"
          />
        </div>

        {/* Address card */}
        <div
          ref={cardRef}
          data-reveal="up"
          style={delay(150)}
          className="flex min-w-0 flex-col justify-center gap-[30px] rounded-[20px] bg-alternate px-5 py-10 md:p-[50px] xl:p-10"
        >
          <ClinicFacts show={['address', 'landmark']} columns={1} />
          <p className="border-t border-border pt-[25px] text-small text-text">{clinic.nearbyAreas}</p>
          <SmartLink href={clinic.mapsHref} className={`${button} w-full`}>
            {actions.directions}
            <span className="sr-only"> to {clinic.name} on Google Maps (opens in a new tab)</span>
          </SmartLink>
        </div>
      </div>
    </section>
  )
}
