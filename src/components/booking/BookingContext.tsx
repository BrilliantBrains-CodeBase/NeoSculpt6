import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface BookingState {
  isOpen: boolean
  open: () => void
  close: () => void
}

const BookingContext = createContext<BookingState | null>(null)

// Opens the "Book a Consultation" popup (BookingDialog) from anywhere: top bar, header, mobile menu, page sections.
export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>')
  return ctx
}
