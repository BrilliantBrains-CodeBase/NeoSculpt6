import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay, h2, italicLine } from '../shared'
import { CtaRow } from './CtaButton'
import { ServiceVideo } from './ServiceVideo'

// Service section 3: consultation highlight. The doc's "light reference site" layout (large image left, paragraph
// block right) drawn as the black template's image + text row (services__rhinoplasty "Candidates", 6b63071;
// post-38160.css): 1400px wide, rounded 20px photo at 48%, text at 52%, a 120px gap (60px tablet, 50px mobile).
// Below xl the photo sits above the text. A page with an approved YouTube video (videos.json) shows it under the photo
// on desktop and after the text and buttons below that (ServiceVideo). On desktop the shorter column stays pinned
// while the longer one scrolls (not in the theme; same sticky pattern as HubTreatments).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceConsultation({ consultation }: { consultation: ServiceContent['consultation'] }) {
  const imageRef = useReveal<HTMLDivElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLDivElement>()
  const videoRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  // Desktop: both columns stick 40px below the top of the window (the header scrolls away), so whichever is shorter
  // stays in view while the longer one scrolls past, and both reach the section's end together.
  const sticky = 'xl:sticky xl:top-10 xl:self-start'

  return (
    <section
      id="service-consultation"
      aria-labelledby="service-consultation-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col gap-[50px] px-5 md:mb-[100px] md:gap-[60px] md:px-[30px] xl:mb-[150px] xl:grid xl:grid-cols-[48%_minmax(0,1fr)] xl:gap-x-[120px] xl:px-10"
    >
      {/* Text first in the markup, so the H2 comes before the video's H3 and the buttons before the player. */}
      <div className={`flex flex-col items-start gap-[30px] xl:col-start-2 xl:row-start-1 ${sticky}`}>
        <h2 id="service-consultation-heading" ref={titleRef} data-reveal="up" className={`${h2} text-balance`}>
          {consultation.h2}
        </h2>
        <div ref={textRef} data-reveal="up" style={delay(150)} className="flex flex-col gap-5">
          {consultation.introLine && <p className={`${italicLine} text-secondary`}>{consultation.introLine}</p>}
          {consultation.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div ref={ctaRef} data-reveal="up" style={delay(300)}>
          <CtaRow ctas={consultation.ctas} />
        </div>
      </div>

      {/* Photo and video: one column on desktop. Below xl the wrapper drops out (display: contents) and the photo moves
          to the top (order-first), so phones and tablets read photo, text, video. */}
      <div className={`contents xl:col-start-1 xl:row-start-1 xl:flex xl:flex-col xl:gap-10 ${sticky}`}>
        <div ref={imageRef} data-reveal="pop" className="order-first w-full max-w-[640px] xl:order-none xl:max-w-none">
          <img
            src={consultation.image.src}
            width={consultation.image.width}
            height={consultation.image.height}
            alt={consultation.image.alt}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-[20px] object-cover"
          />
        </div>
        {consultation.video && (
          <div ref={videoRef} data-reveal="up" className="w-full max-w-[640px] xl:max-w-none">
            <ServiceVideo video={consultation.video} />
          </div>
        )}
      </div>
    </section>
  )
}
