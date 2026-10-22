import type { Cta } from '../../data/services/types'
import { useBooking } from '../booking/BookingContext'
import { SmartLink } from '../SmartLink'
import { button, lightButton } from '../shared'

// A service-page button from the data: `book` opens the booking popup (BookingDialog), an href is a link (a page,
// "#cost" on the same page, or tel:). In a row the first button is the filled accent one and the rest use the light
// fill, as in the home hero.

export function CtaButton({ cta, className = button }: { cta: Cta; className?: string }) {
  const { open } = useBooking()
  if ('action' in cta) {
    return (
      <button type="button" onClick={open} className={className}>
        {cta.label}
      </button>
    )
  }
  return (
    <SmartLink href={cta.href} className={className}>
      {cta.label}
    </SmartLink>
  )
}

export function CtaRow({ ctas, className = '' }: { ctas: Cta[]; className?: string }) {
  if (!ctas.length) return null
  return (
    <div className={`flex flex-wrap items-center gap-x-[25px] gap-y-[15px] ${className}`}>
      {ctas.map((cta, i) => (
        <CtaButton key={cta.label} cta={cta} className={i === 0 ? button : lightButton} />
      ))}
    </div>
  )
}
