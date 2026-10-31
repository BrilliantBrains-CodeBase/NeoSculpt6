import { clinic } from '../../data/site'

// A WhatsApp chat with the clinic, message filled in. BookingForm offers it when sending to the backend fails.
export function whatsappMessageHref(lines: string[]) {
  return `${clinic.whatsappHref}?text=${encodeURIComponent(lines.join('\n'))}`
}

// Phone or WhatsApp number check: digits, spaces, + ( ) and -, with 10 to 15 digits (E.164 maximum).
// Returns a message to show, or null when the number looks usable.
export function phoneError(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Enter your phone or WhatsApp number so we can reach you.'
  if (!/^[+0-9 ()-]+$/.test(trimmed)) return 'Use digits only, with an optional + country code, e.g. +91 98765 43210.'
  const digits = trimmed.replace(/\D/g, '').length
  if (digits < 10) return 'That number looks too short. Enter at least 10 digits, e.g. +91 98765 43210.'
  if (digits > 15) return 'That number looks too long. Check it and try again.'
  return null
}
