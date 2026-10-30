import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { clinic } from '../../data/site'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { Logo } from '../Logo'
import { BurgerIcon, PhoneIcon } from '../icons'
import { DesktopNav } from './DesktopNav'
import { MobileMenu } from './MobileMenu'

// Rejuvita header template 120 (rejuvita-scrape/pages/home/rendered.html, elementor/css/post-120.css): an
// announcement bar, then a transparent row laid over the first section (absolute, not sticky).
// Row layouts (theme breakpoints, plus `wide` because our menu is longer than the theme's):
//   >=1760 (wide)  menu 36% | logo 28% centred | phone + outlined button 36%    <- the theme's desktop layout
//   1300-1759 (nav) logo | menu | button                                       <- compact, so the menu never wraps
//   768-1299 (md)  logo | button + burger                                      <- theme tablet
//   <=767          logo | burger                                               <- theme mobile
// Copy: homepage.md "Global elements".

const outlineButton =
  'rounded-[7px] border border-secondary px-[35px] py-[14px] nav:px-[28px] wide:px-[35px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-background focus-visible:border-primary focus-visible:bg-primary focus-visible:text-background'

export function SiteHeader() {
  const { pathname } = useLocation()
  const { open: openBooking } = useBooking()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useReveal<HTMLDivElement>()
  const logoRef = useReveal<HTMLDivElement>()
  const actionsRef = useReveal<HTMLDivElement>()

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header className="absolute inset-x-0 top-0 z-[99]">
      {/* Announcement bar (theme container 1cb50bcb): bg `text`, meta text in `alternate`, accent link. */}
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-[5px] bg-text px-5 py-[9px] text-center md:px-[30px] xl:px-10">
        <p className="text-meta font-medium text-alternate">
          Whitefield, Bangalore
          <span aria-hidden="true"> · </span>
          {clinic.hours.label}
          <span aria-hidden="true"> · </span>
          <a href={clinic.phoneHref} className="whitespace-nowrap transition-colors duration-300 hover:text-accent focus-visible:text-accent">
            {clinic.phone}
          </a>
        </p>
        <button
          type="button"
          onClick={openBooking}
          className="text-button font-semibold text-accent uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary"
        >
          Book Consultation
        </button>
      </div>

      {/* Main row (theme container 2bdc658f). `relative` anchors the Specialities mega-menu. */}
      <div className="relative flex items-center px-5 py-5 md:min-h-[92px] md:px-[30px] md:py-[25px] xl:min-h-[94px] xl:px-10">
        <div ref={logoRef} data-reveal className="order-1 flex shrink-0 wide:order-2 wide:w-[28%] wide:justify-center">
          <Logo />
        </div>

        <div ref={navRef} data-reveal className="order-2 ml-[30px] hidden nav:block wide:order-1 wide:ml-0 wide:w-[36%]">
          <DesktopNav />
        </div>

        <div ref={actionsRef} data-reveal className="order-3 ml-auto flex items-center justify-end gap-[30px] wide:ml-0 wide:w-[36%]">
          <a
            href={clinic.phoneHref}
            className="hidden items-center gap-2.5 text-small whitespace-nowrap text-secondary transition-colors duration-300 hover:text-primary focus-visible:text-primary wide:inline-flex"
          >
            <PhoneIcon />
            {clinic.phone}
          </a>
          <button type="button" onClick={openBooking} className={`hidden md:inline-block ${outlineButton}`}>
            Book a Consultation
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="text-secondary transition-colors duration-300 hover:text-tertiary focus-visible:text-tertiary nav:hidden"
          >
            <BurgerIcon />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
