import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { SiteHeader } from '../components/header/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BackToTop } from '../components/BackToTop'
import { MobileActionBar } from '../components/MobileActionBar'
import { FloatingWhatsApp } from '../components/FloatingWhatsApp'
import { BookingProvider } from '../components/booking/BookingContext'
import { BookingDialog } from '../components/booking/BookingDialog'
import { captureAttribution } from '../lib/attribution'

// Global chrome. Still to come from homepage.md "Global elements": the floating Call button.
// On phones the page is padded by the sticky bar's height (64px plus the safe area) so the footer stays visible.
export function SiteLayout() {
  // The visit's landing page, referrer and ad tags, sent with a booking request (src/lib/attribution.ts).
  useEffect(captureAttribution, [])
  return (
    <BookingProvider>
      {/* New pages open at the top (or at their #anchor); Back/Forward return to where you were. */}
      <ScrollRestoration />
      <div className="relative min-h-screen bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] font-body text-text md:pb-0">
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
        <BackToTop />
        <FloatingWhatsApp />
        <MobileActionBar />
      </div>
      <BookingDialog />
    </BookingProvider>
  )
}
