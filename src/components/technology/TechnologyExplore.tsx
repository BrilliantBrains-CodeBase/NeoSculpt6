import type { Cta } from '../../data/services/types'
import type { TechnologyExplore as Explore } from '../../data/technology/types'
import type { NavLink } from '../../data/nav'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from '../icons'
import { button, lightButton } from '../shared'
import { CtaButton } from '../service/CtaButton'

// Technology "Explore" block: the doc's sidebar ("Our Technology" list, related treatments and the contact card,
// technology-international-patient.md "—. Sidebar / explore more"). The black template has no sidebar, so it is one
// full-width `alternate` panel, as on the service pages (ServiceSidebar), but below the closing band: the boilerplate
// keeps the CTA above Explore, Instagram and the footer. Left: the other technology pages in two columns, then the
// related treatments under the doc's own label. Right: the contact card's three actions (booking popup, call,
// WhatsApp). It takes the closing band's shorter gap above the Instagram row. Only the doc's links; `npm run verify`
// checks each resolves. Still an <aside>: it points elsewhere.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const link =
  'transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2'

function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-10 border-t border-border md:grid-cols-2">
      {links.map((item) => (
        <li key={item.href} className="border-b border-border">
          <SmartLink href={item.href} className={`flex items-center justify-between gap-4 py-4 text-secondary ${link}`}>
            {item.label}
            <ArrowRightIcon className="size-3 shrink-0 text-tertiary" />
          </SmartLink>
        </li>
      ))}
    </ul>
  )
}

function ContactAction({ cta, index }: { cta: Cta; index: number }) {
  const href = 'href' in cta ? cta.href : ''
  const icon = href.startsWith('tel:') ? <PhoneIcon /> : href.includes('wa.me') ? <WhatsAppIcon /> : null
  if (!icon) return <CtaButton cta={cta} className={`${index === 0 ? button : lightButton} w-full`} />
  return (
    <SmartLink href={href} className={`inline-flex items-center gap-2.5 text-secondary ${link}`}>
      <span className="text-primary">{icon}</span>
      {cta.label}
    </SmartLink>
  )
}

export function TechnologyExplore({ explore }: { explore: Explore }) {
  const panelRef = useReveal<HTMLDivElement>()

  return (
    <aside
      id="technology-explore"
      aria-labelledby="technology-explore-heading"
      className="mx-auto mb-[60px] w-full max-w-[1400px] px-5 md:mb-20 md:px-[30px] xl:mb-[100px] xl:px-10"
    >
      <div
        ref={panelRef}
        data-reveal="up"
        className="grid grid-cols-1 gap-10 rounded-[20px] bg-alternate p-[30px] md:gap-[50px] md:p-[50px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-0 xl:p-[70px]"
      >
        <div className="flex flex-col gap-[30px] xl:pr-[70px]">
          <h2 id="technology-explore-heading" className="font-heading text-h3 text-secondary uppercase">
            {explore.heading}
          </h2>
          <LinkList links={explore.links} />
          {explore.related.length > 0 && (
            <>
              <h3 className="mt-5 font-heading text-h5 text-secondary uppercase">{explore.relatedHeading}</h3>
              <LinkList links={explore.related} />
            </>
          )}
        </div>

        <ul className="flex flex-col items-start gap-5 border-t border-border pt-10 xl:justify-center xl:border-t-0 xl:border-l xl:pt-0 xl:pl-[70px]">
          {explore.contact.map((cta, i) => (
            <li key={cta.label} className="w-full">
              <ContactAction cta={cta} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
