import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { PlayIcon } from '../icons'
import { delay, h2, italicLine } from '../shared'
import { CtaRow } from './CtaButton'

// Service section 3: consultation highlight. The doc's "light reference site" layout (large image left, paragraph
// block right) drawn as the black template's image + text row (services__rhinoplasty "Candidates", 6b63071;
// post-38160.css): 1400px wide, rounded 20px photo at 48%, text at 52%, a 120px gap (60px tablet, 50px mobile).
// Below xl the photo sits above the text. A video the doc names here is a plain link to it (no embedded player).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceConsultation({ consultation }: { consultation: ServiceContent['consultation'] }) {
  const imageRef = useReveal<HTMLDivElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="service-consultation"
      aria-labelledby="service-consultation-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col gap-[50px] px-5 md:mb-[100px] md:gap-[60px] md:px-[30px] xl:mb-[150px] xl:flex-row xl:items-center xl:gap-[120px] xl:px-10"
    >
      <div ref={imageRef} data-reveal="pop" className="w-full max-w-[640px] xl:w-[48%] xl:max-w-none xl:shrink-0">
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

      <div className="flex flex-col items-start gap-[30px]">
        <h2 id="service-consultation-heading" ref={titleRef} data-reveal="up" className={`${h2} text-balance`}>
          {consultation.h2}
        </h2>
        <div ref={textRef} data-reveal="up" style={delay(150)} className="flex flex-col gap-5">
          {consultation.introLine && <p className={`${italicLine} text-secondary`}>{consultation.introLine}</p>}
          {consultation.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {consultation.video && (
            <p>
              <SmartLink
                href={consultation.video.url}
                className="inline-flex items-center gap-2.5 text-secondary underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline"
              >
                <PlayIcon className="size-3 shrink-0 text-primary" />
                Watch: {consultation.video.title}
                <span className="sr-only"> (opens YouTube in a new tab)</span>
              </SmartLink>
            </p>
          )}
        </div>
        <div ref={ctaRef} data-reveal="up" style={delay(300)}>
          <CtaRow ctas={consultation.ctas} />
        </div>
      </div>
    </section>
  )
}
