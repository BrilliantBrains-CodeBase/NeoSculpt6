import { Outlet } from 'react-router-dom'
import { SiteHeader } from '../components/header/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BackToTop } from '../components/BackToTop'
import { MobileActionBar } from '../components/MobileActionBar'
import { BookingProvider } from '../components/booking/BookingContext'
import { BookingDialog } from '../components/booking/BookingDialog'

// Global chrome. Still to come from homepage.md "Global elements": the floating WhatsApp/Call buttons.
// On phones the page is padded by the sticky bar's height (64px plus the safe area) so the footer stays visible.
export function SiteLayout() {
  return (
    <BookingProvider>
      <div className="relative min-h-screen bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] font-body text-text md:pb-0">
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
        <BackToTop />
        <MobileActionBar />
      </div>
      <BookingDialog />
    </BookingProvider>
  )
}
