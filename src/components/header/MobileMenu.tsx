import { useId, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { clinic } from '../../data/site'
import { findMyTreatment, primaryNav, type NavLink } from '../../data/nav'
import { useBooking } from '../booking/BookingContext'
import { useModal } from '../useModal'
import { usePresence } from '../usePresence'
import { SmartLink } from '../SmartLink'
import { ChevronDownIcon, CloseIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '../icons'
import { isCurrent } from './DesktopNav'

// Rejuvita mobile menu popup 138 (elementor/css/post-138.css), shown <=1180px from the burger: a 500px panel
// (full width <=767px) sliding in from the right over a black/80 overlay, bg `alternate`, padding 50 (30 mobile).
// Top: Aboreto h3 items, `secondary`, hover/current `primary`, submenus under a chevron in 13px tracked caps.
// Bottom: icon links (the theme's phone + "Our Locations"; we add WhatsApp and drop its search and cart) and a
// full-width `accent` button.
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const { open: openBooking } = useBooking()
  const { mounted, shown } = usePresence(open, 500)
  const ref = useModal<HTMLDivElement>(open && mounted, onClose)
  const [expanded, setExpanded] = useState<string | null>(null)
  const uid = useId()
  if (!mounted) return null

  const subLinks = (label: string): NavLink[] | undefined => {
    const item = primaryNav.find((i) => i.label === label)
    if (item?.mega) return [...item.mega.map(({ label, href }) => ({ label, href })), findMyTreatment]
    return item?.children
  }
  const iconLink = 'inline-flex items-center gap-2 font-semibold text-button text-secondary uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary'

  return (
    <div className="fixed inset-0 z-[10000] xl:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 transition-opacity duration-500 motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        // Links close the menu (also covers same-page /#anchors, which don't change the route).
        onClick={(e) => (e.target as HTMLElement).closest('a') && onClose()}
        className={`absolute inset-y-0 right-0 flex h-dvh w-full flex-col justify-between gap-[55px] overflow-y-auto bg-alternate p-[30px] shadow-[0_4px_50px_rgba(0,0,0,0.2)] outline-none transition-transform duration-500 motion-reduce:transition-none md:w-[500px] md:gap-[60px] md:p-[50px] ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-5 right-5 p-1 text-secondary transition-colors duration-300 hover:text-primary focus-visible:text-primary md:top-[25px] md:right-[25px]"
        >
          <CloseIcon />
        </button>

        <nav aria-label="Main">
          <ul className="flex flex-col gap-[15px] md:gap-5">
            {primaryNav.map((item) => {
              const current = isCurrent(item, pathname)
              const subs = subLinks(item.label)
              const isOpen = expanded === item.label
              const color = current ? 'text-primary' : 'text-secondary hover:text-primary focus-visible:text-primary'
              const listId = `${uid}-${item.label}`
              return (
                <li key={item.label}>
                  <span className={`flex items-center gap-2.5 transition-colors duration-300 ${color}`}>
                    <SmartLink href={item.href} aria-current={current ? 'page' : undefined} className="font-heading text-h3 uppercase">
                      {item.label}
                    </SmartLink>
                    {subs && (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={listId}
                        aria-label={`${item.label} submenu`}
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        className="p-1.5"
                      >
                        <ChevronDownIcon className={`size-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </span>
                  {subs && isOpen && (
                    <ul id={listId} className="mt-[15px] flex flex-col gap-3.5 md:mt-5">
                      {subs.map((l) => (
                        <li key={l.href}>
                          <SmartLink
                            href={l.href}
                            aria-current={pathname === l.href ? 'page' : undefined}
                            className={`type-accent block font-semibold uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary ${
                              pathname === l.href ? 'text-primary' : 'text-secondary'
                            }`}
                          >
                            {l.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-3">
            <li>
              <a href={clinic.phoneHref} className={iconLink}>
                <PhoneIcon className="size-5 shrink-0 md:size-[18px]" />
                {clinic.phone}
              </a>
            </li>
            <li>
              <SmartLink href={clinic.whatsappHref} className={iconLink}>
                <WhatsAppIcon className="size-5 shrink-0 md:size-[18px]" />
                WhatsApp Us
              </SmartLink>
            </li>
            <li>
              <SmartLink href={clinic.mapsHref} className={iconLink}>
                <MapPinIcon className="size-5 shrink-0 md:size-[18px]" />
                Our Location
              </SmartLink>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => {
              onClose()
              openBooking()
            }}
            className="w-full rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
          >
            Book a Consultation
          </button>
        </div>
      </div>
    </div>
  )
}
