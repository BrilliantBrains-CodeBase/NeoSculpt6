import { Outlet } from 'react-router-dom'
import { SiteHeader } from '../components/header/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BackToTop } from '../components/BackToTop'
import { BookingProvider } from '../components/booking/BookingContext'
import { BookingDialog } from '../components/booking/BookingDialog'

// Global chrome. Still to come from homepage.md "Global elements": the floating WhatsApp/Call buttons and the
// sticky mobile bar.
export function SiteLayout() {
  return (
    <BookingProvider>
      <div className="relative min-h-screen bg-background font-body text-text">
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
        <BackToTop />
      </div>
      <BookingDialog />
    </BookingProvider>
  )
}
