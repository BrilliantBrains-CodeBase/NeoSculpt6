import type { ReactNode } from 'react'
import type { RoutePage } from '../../data/types'
import type { Cta } from '../../data/services/types'
import { credentialLine, portraitFor, publicSocialLinks, type Doctor, type SocialNetwork } from '../../data/doctors'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { SmartLink } from '../SmartLink'
import { CtaRow } from '../service/CtaButton'
import { FacebookIcon, InstagramIcon, LinkedInIcon, YoutubeIcon } from '../icons'
import { delay, eyebrow } from '../shared'
import { DoctorAvatar } from './DoctorAvatar'

// Doctor profile section 1. The service hero's card (ServiceHero: photo panel + `alternate` text panel, radius 20)
// with the doctor's portrait in the photo panel; on tablet the two columns stay side by side, on phones they stack.
// Breadcrumb Home › Our Doctors › name; the H1 is page.h1, which generate-pages.mjs takes from the record's seo.h1.
// Under the role: the approved degrees on one line (as the Neo Fertility and Derma Solutions profiles show them).
// Buttons: book (scrolls to the profile's booking form) and contact. Social icons only once a profile URL is approved.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const networks: Record<SocialNetwork, { label: string; icon: ReactNode }> = {
  instagram: { label: 'Instagram', icon: <InstagramIcon /> },
  facebook: { label: 'Facebook', icon: <FacebookIcon /> },
  youtube: { label: 'YouTube', icon: <YoutubeIcon /> },
  linkedin: { label: 'LinkedIn', icon: <LinkedInIcon /> },
}

export function DoctorHero({ doctor, page }: { doctor: Doctor; page: RoutePage }) {
  const imageRef = useReveal<HTMLDivElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const textRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  const portrait = portraitFor(doctor)
  const credentials = credentialLine(doctor)
  const social = publicSocialLinks(doctor)
  const ctas: Cta[] = [
    { label: doctor.ctas.profileLabel, action: 'book' },
    { label: doctor.ctas.contactLabel, href: doctor.ctas.contactHref },
  ]

  return (
    <section id="doctor-hero" aria-labelledby="doctor-hero-heading" className="pt-(--header-offset)">
      <div className="mx-auto mt-10 mb-20 w-full max-w-[1480px] px-5 md:mt-[60px] md:mb-[100px] md:px-[30px] xl:mt-20 xl:mb-[150px] xl:px-10">
        <div className="grid grid-cols-1 overflow-hidden rounded-[20px] bg-alternate md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:min-h-[680px] xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div ref={imageRef} data-reveal="" className="relative aspect-[4/5] md:aspect-auto md:min-h-[560px]">
            {portrait ? (
              <img
                src={portrait.src}
                width={portrait.width}
                height={portrait.height}
                alt={portrait.alt}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover object-[50%_15%]"
              />
            ) : (
              <DoctorAvatar initials={doctor.initials} className="absolute inset-0 text-[clamp(64px,14vw,160px)]" />
            )}
          </div>

          <div className="flex min-w-0 flex-col items-start justify-center gap-5 px-5 py-[50px] md:p-[50px] xl:px-[90px] xl:py-20">
            <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" style={delay(150)} />
            <div ref={textRef} data-reveal="up" style={delay(300)} className="flex flex-col items-start gap-5">
              <p className={eyebrow}>{doctor.hero.eyebrow}</p>
              <h1 id="doctor-hero-heading" className="font-heading text-h2 text-balance text-secondary uppercase">
                {page.h1}
              </h1>
              <p className="text-primary">{doctor.role}</p>
              {credentials && <p className="font-heading text-h6 tracking-[1px] text-tertiary uppercase">{credentials}</p>}
              <p className="max-w-[680px]">{doctor.hero.intro}</p>
            </div>
            <div ref={ctaRef} data-reveal="up" style={delay(450)} className="mt-2.5 flex flex-col items-start gap-[25px]">
              <CtaRow ctas={ctas} />
              {social.length > 0 && (
                <ul aria-label={`${doctor.displayName} on social media`} className="flex gap-[5px]">
                  {social.map((s) => (
                    <li key={s.network}>
                      <SmartLink
                        href={s.href}
                        aria-label={`${doctor.displayName} on ${networks[s.network].label} (opens in a new tab)`}
                        className="grid size-[45px] place-items-center rounded-full bg-border text-secondary transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
                      >
                        {networks[s.network].icon}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
