import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { clinic, footerNav, legalNav, medicalReviewLine } from '../data/site'
import { useReveal } from './useReveal'
import { SmartLink } from './SmartLink'
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, YoutubeIcon } from './icons'

// Rejuvita footer (rejuvita-scrape/pages/home/rendered.html, styles from elementor/css/post-161.css)
// with the NeoSculpt6 copy from content/home-page/homepage.md section 16.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const h6 = 'text-h6 font-medium uppercase'
const columnTitle = 'mb-5 text-center max-md:text-left font-heading text-h4 text-secondary xl:mb-[30px]'

const socialLinks = [
  { key: 'facebook', label: 'Facebook', href: clinic.social.facebook, icon: <FacebookIcon /> },
  { key: 'instagram', label: 'Instagram', href: clinic.social.instagram, icon: <InstagramIcon /> },
  { key: 'youtube', label: 'YouTube', href: clinic.social.youtube, icon: <YoutubeIcon /> },
].filter((s) => s.href)

export function SiteFooter() {
  const menuRef = useReveal<HTMLElement>()
  const addressRef = useReveal<HTMLUListElement>()
  const logoRef = useReveal<HTMLDivElement>()
  const contactsRef = useReveal<HTMLDivElement>()
  const { address } = clinic

  return (
    <footer className="bg-background bg-[url(/images/footer-bg.webp)] bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col items-center max-md:items-start px-5 pt-[60px] pb-10 md:gap-[60px] md:px-[30px] md:pt-10 xl:gap-[100px] xl:px-10">
        {/* Row 1: menu */}
        <nav ref={menuRef} data-reveal aria-label="Footer" className="w-full pb-[50px] md:pb-0">
          <ul className="flex flex-wrap justify-center max-md:justify-start gap-x-10 md:gap-x-[60px] md:gap-y-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  className={`${h6} block py-[5px] text-secondary transition-colors duration-300 hover:text-tertiary focus-visible:text-tertiary md:py-0`}
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Row 2: address / logo / contacts. On tablet the logo takes its own row first, as in the
            theme's <=1180px rules; our address and email are too long for three columns at 768px. */}
        <div className="mb-[45px] flex w-full flex-col items-center max-md:items-start gap-12 md:mb-0 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-10 xl:flex-nowrap xl:items-center xl:gap-0">
          <div className="w-full md:basis-[calc(50%-20px)] xl:basis-1/3">
            <h2 className={columnTitle}>Address</h2>
            <ul
              ref={addressRef}
              data-reveal-stagger
              className="flex flex-col items-center max-md:items-start gap-2.5 text-center max-md:text-left text-text xl:gap-[15px]"
            >
              <li style={{ '--i': 0 } as CSSProperties}>
                <a
                  href={clinic.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-primary"
                >
                  {address.streetAddress}, {address.addressLocality} {address.postalCode}
                </a>
                <span className="block">Landmark: {address.landmark.replace(/^Beside/, 'beside')}</span>
              </li>
              <li style={{ '--i': 1 } as CSSProperties}>{clinic.hours.label}</li>
            </ul>
          </div>

          <div
            ref={logoRef}
            data-reveal
            className="flex w-full flex-col items-center max-md:items-start gap-[25px] md:order-first md:basis-full xl:order-none xl:basis-1/3"
          >
            <Link to="/" aria-label={`${clinic.name} home`}>
              <img
                src="/images/logo-stacked.webp"
                alt={`${clinic.name}, The Art of Transformation`}
                width={690}
                height={510}
                loading="lazy"
                className="h-[150px] w-auto md:h-[120px] xl:h-[170px]"
              />
            </Link>
            <p className={`${h6} text-center max-md:text-left text-tertiary`}>
              {clinic.tagline.split(' · ').map((part) => (
                <span key={part} className="block text-balance">
                  {part}
                </span>
              ))}
            </p>
          </div>

          <div
            ref={contactsRef}
            data-reveal
            className="flex w-full flex-col items-center max-md:items-start gap-5 md:basis-[calc(50%-20px)] xl:basis-1/3"
          >
            <div className="mb-2.5 w-full">
              <h2 className={columnTitle}>Contacts</h2>
              <ul className={`${h6} flex flex-col items-center max-md:items-start gap-[15px] text-secondary`}>
                <li>
                  <a href={clinic.phoneHref} className="group inline-flex items-center gap-[9px] transition-colors duration-300 hover:text-primary">
                    <PhoneIcon />
                    {clinic.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${clinic.email}`} className="group inline-flex items-center gap-[9px] transition-colors duration-300 hover:text-primary">
                    <MailIcon />
                    {clinic.email}
                  </a>
                </li>
              </ul>
            </div>
            {socialLinks.length > 0 && (
              <ul className="flex flex-wrap justify-center max-md:justify-start gap-x-[7px] gap-y-5">
                {socialLinks.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${clinic.name} on ${s.label}`}
                      className="flex rounded-full bg-border p-2.5 text-secondary transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Row 3: sister clinics, medical review line, legal + copyright */}
        <div className="flex w-full flex-col items-center max-md:items-start gap-3 text-center max-md:text-left text-small text-text">
          <p>
            Our sister clinics:{' '}
            {clinic.sisterClinics.map((c, i) => (
              <span key={c.name}>
                {i > 0 && ' · '}
                {c.href ? (
                  <SmartLink href={c.href} className="transition-colors duration-300 hover:text-primary">
                    {c.name}
                  </SmartLink>
                ) : (
                  c.name
                )}
              </span>
            ))}
          </p>
          <p className="max-w-[760px] text-meta">{medicalReviewLine}</p>
          <p className="mt-2">
            {legalNav.map((item) => (
              <span key={item.href}>
                <SmartLink href={item.href} className="transition-all duration-300 hover:text-primary">
                  {item.label}
                </SmartLink>
                {' · '}
              </span>
            ))}
            © {new Date().getFullYear()} {clinic.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
