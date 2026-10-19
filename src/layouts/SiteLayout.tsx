import { Outlet } from 'react-router-dom'

// Global chrome. Header (top bar, nav, mega-menu), footer, floating WhatsApp/Call buttons and the
// sticky mobile bar from homepage.md "Global elements" go here.
export function SiteLayout() {
  return (
    <div className="min-h-screen bg-background font-body text-text">
      <header data-slot="header" />
      <main>
        <Outlet />
      </main>
      <footer data-slot="footer" />
    </div>
  )
}
