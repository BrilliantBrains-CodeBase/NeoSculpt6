import { useState } from 'react'
import { clinic } from '../data/site'
import { findMyTreatment } from '../data/nav'
import { useBooking } from './booking/BookingContext'
import { FollowSheet } from './FollowSheet'
import { CalendarCheckIcon, PhoneIcon, ShareIcon, SparkleIcon, WhatsAppLogo } from './icons'

// Sticky mobile bar, phones only (<=767px): Follow · Call · Book · WhatsApp · AI Analysis, laid out from the user's
// reference screenshot. Book is a raised gold (tertiary) circle that opens the same booking popup as the header button.
// The bar and the bump behind the circle are drawn as one cream shape with one drop-shadow, so the bump reads as part
// of the bar and frames the circle like a ring. SiteLayout pads the page bottom by the bar's height so it never covers
// the footer.
const item =
  'relative flex min-w-0 flex-col items-center justify-end gap-1.5 pb-2.5 text-[12px] font-semibold leading-none whitespace-nowrap transition-colors duration-300'
const plain = `${item} text-background hover:text-accent focus-visible:text-accent`
const icon = 'size-[21px]'

// Falls back to the Find My Treatment form until the external tool's URL is filled in (clinic.aiAnalysisHref).
const aiAnalysis = clinic.aiAnalysisHref
  ? { href: clinic.aiAnalysisHref, target: '_blank', rel: 'noopener noreferrer', external: true }
  : { href: findMyTreatment.href, external: false }

export function MobileActionBar() {
  const { open: openBooking } = useBooking()
  const [followOpen, setFollowOpen] = useState(false)

  return (
    <>
      <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-[9990] md:hidden">
        {/* Background: bar + bump, shadowed together */}
        <div aria-hidden="true" className="absolute inset-0 drop-shadow-[0_-3px_10px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-0 bg-secondary" />
          <div className="absolute -top-[30px] left-1/2 size-[76px] -translate-x-1/2 rounded-full bg-secondary" />
        </div>

        <div className="relative box-content grid h-16 grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          <button type="button" onClick={() => setFollowOpen(true)} aria-haspopup="dialog" className={plain}>
            <ShareIcon className={icon} />
            Follow
            <span className="sr-only"> us on social media</span>
          </button>

          <a href={clinic.phoneHref} className={plain}>
            <PhoneIcon className={icon} />
            Call
          </a>

          <button type="button" onClick={openBooking} className={`${item} group text-background`}>
            <span className="absolute -top-[22px] left-1/2 flex size-[60px] -translate-x-1/2 items-center justify-center rounded-full bg-tertiary text-background transition-[filter] duration-300 group-hover:brightness-90 group-focus-visible:brightness-90">
              <CalendarCheckIcon className="size-[26px]" />
            </span>
            Book
            <span className="sr-only"> a consultation</span>
          </button>

          <a href={clinic.whatsappHref} target="_blank" rel="noopener noreferrer" className={plain}>
            <WhatsAppLogo className={icon} />
            WhatsApp
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          <a href={aiAnalysis.href} target={aiAnalysis.target} rel={aiAnalysis.rel} className={plain}>
            <SparkleIcon className={icon} />
            AI Analysis
            {aiAnalysis.external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        </div>
      </nav>

      <FollowSheet open={followOpen} onClose={() => setFollowOpen(false)} />
    </>
  )
}
