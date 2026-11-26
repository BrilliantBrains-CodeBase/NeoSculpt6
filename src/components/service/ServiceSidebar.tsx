import type { ServiceContent } from '../../data/services/types'
import { pageByPath } from '../../data/entries'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { CtaButton } from './CtaButton'

// Service "Explore our services" block (service-page.md, sidebar: same-speciality links, "View all" to the hub, and
// the "Contact Us Today!" card). The black template has no sidebar, and a side column beside sections 2–4 broke the
// page into uneven halves, so it is one full-width `alternate` panel after the FAQs instead: the links in two
// columns at the left, the contact card at the right (below it on tablet and mobile). Still an <aside>: it points
// to related pages rather than adding to this one.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const link =
  'transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2'

export function ServiceSidebar({ sidebar }: { sidebar: ServiceContent['sidebar'] }) {
  const panelRef = useReveal<HTMLDivElement>()
  const hubName = pageByPath.get(sidebar.viewAll.href)?.name ?? ''

  return (
    <aside
      id="service-explore"
      aria-labelledby="service-explore-heading"
      className="mx-auto mb-20 w-full max-w-[1400px] px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <div
        ref={panelRef}
        data-reveal="up"
        className="grid grid-cols-1 gap-10 rounded-[20px] bg-alternate p-[30px] md:gap-[50px] md:p-[50px] xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-0 xl:p-[70px]"
      >
        <div className="flex flex-col gap-[30px] xl:pr-[70px]">
          <h2 id="service-explore-heading" className="font-heading text-h3 text-secondary uppercase">
            {sidebar.heading}
          </h2>
          <ul className="grid grid-cols-1 gap-x-10 border-t border-border md:grid-cols-2">
            {sidebar.links.map((item) => (
              <li key={item.href} className="border-b border-border">
                <SmartLink href={item.href} className={`flex items-center justify-between gap-4 py-4 text-secondary ${link}`}>
                  {item.label}
                  <ArrowRightIcon className="size-3 shrink-0 text-tertiary" />
                </SmartLink>
              </li>
            ))}
          </ul>
          <SmartLink
            href={sidebar.viewAll.href}
            className={`inline-flex items-center gap-2.5 self-start text-button font-semibold text-primary uppercase ${link}`}
          >
            {sidebar.viewAll.label}
            {hubName && <span className="sr-only"> {hubName} treatments</span>}
            <ArrowRightIcon className="size-3 shrink-0" />
          </SmartLink>
        </div>

        <div className="flex flex-col items-start gap-5 border-t border-border pt-10 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-[70px]">
          <h3 className="font-heading text-h4 text-secondary uppercase">{sidebar.contactHeading}</h3>
          <p>{sidebar.contactText}</p>
          <div className="mt-2.5">
            <CtaButton cta={sidebar.cta} />
          </div>
        </div>
      </div>
    </aside>
  )
}
