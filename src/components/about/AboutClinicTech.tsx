import { clinicTech } from '../../data/about'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { Marquee } from '../Marquee'
import { Parts, button, delay, eyebrow, h2, italicLine } from '../shared'

// About extra D: clinic and technology (about-us.md §D). The home "Signature Expertise" layout (HomeSignature: Rejuvita
// cfe3ab5, image left and centred text right on `alternate`, then the technology marquee), with a plain photo in place
// of the hotspots. The copy keeps the decision with the doctor; no platform is presented as a guarantee.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop. Below xl the text sits
// above the image, as in the theme.

export function AboutClinicTech() {
  const imageRef = useReveal<HTMLDivElement>()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const buttonRef = useReveal<HTMLDivElement>()
  const tickerRef = useReveal<HTMLDivElement>()

  return (
    <section id="inside-neosculpt6" aria-labelledby="inside-neosculpt6-heading" className="flex flex-col bg-alternate">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col-reverse items-center max-md:items-start px-5 md:px-[30px] xl:flex-row xl:justify-center xl:px-10 xl:pt-[100px]">
        <div ref={imageRef} data-reveal="up" className="w-full max-w-[660px] xl:w-1/2">
          <img
            src={clinicTech.image.src}
            width={clinicTech.image.width}
            height={clinicTech.image.height}
            alt={clinicTech.image.alt}
            loading="lazy"
            decoding="async"
            className="block aspect-[11/12] h-auto w-full rounded-[20px] object-cover"
          />
        </div>

        <div className="flex w-full flex-col items-center max-md:items-start gap-[30px] py-20 text-center max-md:text-left md:py-[100px] xl:w-1/2 xl:gap-10 xl:p-[50px] min-[1601px]:p-[100px]">
          <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
            {clinicTech.eyebrow}
          </p>
          <h2
            id="inside-neosculpt6-heading"
            ref={titleRef}
            data-reveal="up"
            style={delay(150)}
            className={`${h2} max-w-[600px]`}
          >
            <Parts parts={clinicTech.h2} />
          </h2>
          <p ref={textRef} data-reveal="up" style={delay(300)} className={`${italicLine} max-w-[600px] xl:mb-5`}>
            {clinicTech.text}
          </p>
          <div ref={buttonRef} data-reveal="pop" style={delay(450)}>
            <SmartLink href={clinicTech.cta.href} className={button}>
              {clinicTech.cta.label}
            </SmartLink>
          </div>
        </div>
      </div>

      <div ref={tickerRef} data-reveal="" className="xl:mt-[50px]">
        <Marquee
          items={clinicTech.ticker}
          separator="✦"
          pausable
          label="Technologies at NeoSculpt6"
          className="py-10 [--marquee-gap:80px] [--marquee-item-gap:60px] md:[--marquee-item-gap:80px]"
          itemClassName="font-heading text-h5 text-secondary uppercase"
          separatorClassName="text-[35px] leading-none text-tertiary"
        />
      </div>
    </section>
  )
}
