import { useId } from 'react'
import { useBooking } from './BookingContext'
import { BookingForm } from './BookingForm'
import { useModal } from '../useModal'
import { usePresence } from '../usePresence'
import { CloseIcon } from '../icons'
import { booking } from '../../data/home'

// Rejuvita "Book a Consultation" popup (cmsmasters popup 135, elementor/css/post-135.css): a 1200px card with
// radius 20, photo on the left 40% (hidden <=1180px) and the form on `alternate` with 80px padding.
// Copy from homepage.md section 12. Rendered only while open, so the prerendered page gets no extra heading.
export function BookingDialog() {
  const { isOpen, close } = useBooking()
  const { mounted, shown } = usePresence(isOpen, 300)
  const ref = useModal<HTMLDivElement>(isOpen && mounted, close)
  const titleId = useId()
  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/30 p-5 backdrop-blur-[2px] transition-opacity duration-300 md:p-10 ${shown ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative my-auto flex w-full max-w-[1200px] overflow-hidden rounded-[20px] bg-alternate shadow-[0_4px_50px_rgba(0,0,0,0.2)] outline-none transition-transform duration-300 ${shown ? 'scale-100' : 'scale-95'}`}
      >
        <div className="hidden w-2/5 shrink-0 xl:block">
          {/* TODO: replace with a NeoSculpt6 clinic photo shot for this slot. */}
          <img
            src="/og/about-dr-sandeep-mahapatra.jpeg"
            alt="Dr Sandeep Mahapatra in the NeoSculpt6 clinic, Whitefield"
            width={1122}
            height={1402}
            className="size-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-[30px] px-5 py-[60px] md:p-[50px] md:gap-[50px] xl:p-20">
          <h2 id={titleId} className="text-center font-heading text-h3 text-secondary uppercase text-balance">
            {booking.h2.map((line, i) => (
              <span key={i}>
                {i > 0 && ' '}
                {line.map((part) => (
                  <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                    {part.text}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <BookingForm autoFocus />
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 p-1 text-secondary transition-colors duration-300 hover:text-primary focus-visible:text-primary md:top-[25px] md:right-[25px]"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
