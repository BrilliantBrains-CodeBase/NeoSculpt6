import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface BookingState {
  isOpen: boolean
  open: () => void
  close: () => void
}

const BookingContext = createContext<BookingState | null>(null)

// The page's own lead form, if it has one (home Find My Treatment, About, Contact, doctor profiles): any BookingForm
// outside the popup. Service, technology, hub and International pages have none.
function pageLeadForm() {
  return [...document.querySelectorAll<HTMLFormElement>('form[data-lead-form]')].find((f) => !f.closest('[role="dialog"]'))
}

// "Book a Consultation" from anywhere (top bar, header, mobile menu, action bar, page sections). On a page with a lead
// form it jumps to that form's section; elsewhere it opens the popup (BookingDialog).
export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const open = useCallback(() => {
    const form = pageLeadForm()
    if (!form) {
      setOpen(true)
      return
    }
    // Same as the "Find My Treatment" anchor links: go to the form section's #id (an instant jump, then the section's
    // own entrance fades play). A long JS smooth scroll over the page's animations stuttered.
    // Next tick: a mobile menu closed by the same click unlocks page scroll in its effect cleanup first.
    window.setTimeout(() => {
      const target = form.closest('section') ?? form
      if (target.id && window.location.hash !== `#${target.id}`) window.location.hash = target.id
      else target.scrollIntoView({ block: 'start' })
    }, 0)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>')
  return ctx
}
