import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { clinic } from '../../data/site'
import { bookingDoctors, bookingServices } from '../../data/nav'
import { CalendarIcon, ChevronDownIcon } from '../icons'
import { useBooking } from './BookingContext'
import { whatsappMessageHref } from './whatsapp'
import { getAttribution } from '../../lib/attribution'
import { saveThankYou, submitLead, type LeadSource } from '../../lib/lead'

// The theme's Forminator appointment form (popup 135 / home "Make an appointment"), with the NeoSculpt6
// fields from homepage.md section 12. Shared by the popup (BookingDialog) and every page's own booking section.
// Submitting posts the request to the Apps Script backend (src/lib/lead.ts, apps-script/): it is saved to the leads
// Sheet and the clinic is emailed (a visitor confirmation email exists but is switched off in the script). Then
// /thank-you/ opens.
// If sending fails, the status line offers the clinic's phone and a WhatsApp chat with the details filled in.

const label = 'mb-2 block type-accent font-medium text-secondary uppercase'
const field =
  'block h-[52px] w-full rounded-[7px] border border-border bg-border px-5 text-small text-text placeholder:text-text/70 transition-colors duration-300 outline-none focus:border-primary focus-visible:border-primary aria-invalid:border-primary'
const errorText = 'mt-2 text-meta text-primary'
const hours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18']
const minutes = ['00', '15', '30', '45']

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'date', string>>
const order = ['name', 'phone', 'email', 'date'] as const
type Status = { state: 'idle' } | { state: 'sending' } | { state: 'error'; message: string; waUrl: string }

// Local (not UTC) date as YYYY-MM-DD, the format of <input type="date">.
function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function validate(get: (k: string) => string): Errors {
  const errors: Errors = {}
  if (!get('name')) errors.name = 'Please enter your name.'
  const phone = get('phone')
  const digits = phone.replace(/\D/g, '').length
  if (!phone) errors.phone = 'Please enter your phone or WhatsApp number.'
  else if (/[^\d+()\-\s]/.test(phone) || digits < 10 || digits > 15)
    errors.phone = 'Please enter a valid number with 10 to 15 digits, for example +91 98765 43210.'
  if (get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get('email'))) errors.email = 'Please enter a valid email, for example name@example.com.'
  if (get('date') && get('date') < localToday()) errors.date = 'Please choose today or a later date.'
  return errors
}

function Select({
  id,
  name,
  required,
  children,
  ariaLabel,
  defaultValue = '',
}: {
  id?: string
  name: string
  required?: boolean
  children: ReactNode
  ariaLabel?: string
  defaultValue?: string
}) {
  return (
    <div className="relative">
      <select id={id} name={name} required={required} aria-label={ariaLabel} defaultValue={defaultValue} className={`${field} cursor-pointer appearance-none pr-12`}>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-5 size-2.5 -translate-y-1/2 text-secondary" />
    </div>
  )
}

// Status line text for a failed send, by the backend's error code (apps-script/Code.gs).
function failureMessage(error: string) {
  if (error === 'rate_limited') return 'We already have a request from this number and will be in touch soon.'
  return 'We couldn’t send your request just now. Please try again in a moment, or reach us directly.'
}

// `source` says which form this is (sent with the request). `defaultDoctor` pre-selects a doctor (a doctor's profile
// page); it must be one of `bookingDoctors`.
export function BookingForm({
  source,
  className = '',
  autoFocus = false,
  defaultDoctor,
}: {
  source: LeadSource
  className?: string
  autoFocus?: boolean
  defaultDoctor?: string
}) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const navigate = useNavigate()
  const { isOpen, close } = useBooking()
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  // Set after mount: the home page is prerendered, so a render-time date would be the build date.
  const [minDate, setMinDate] = useState<string>()
  // When the form appeared, so the backend can tell a person (a few seconds at least) from a script.
  const mountedAt = useRef(0)
  useEffect(() => {
    setMinDate(localToday())
    mountedAt.current = Date.now()
  }, [])
  const sending = status.state === 'sending'

  const describedBy = (name: keyof Errors) => (errors[name] ? id(`${name}-error`) : undefined)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    const found = validate(get)
    setErrors(found)
    const firstInvalid = order.find((k) => found[k])
    if (firstInvalid) {
      setStatus({ state: 'idle' })
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    const time = get('hour') ? `${get('hour')}:${get('minute') || '00'}` : ''
    setStatus({ state: 'sending' })
    const result = await submitLead({
      name: get('name'),
      phone: get('phone'),
      email: get('email'),
      service: get('service'),
      doctor: get('doctor'),
      date: get('date'),
      time,
      type: get('type'),
      source,
      ...getAttribution(),
      elapsedMs: Date.now() - mountedAt.current,
      hp: get('ns6_hp'),
    })
    if (result.ok) {
      saveThankYou({ firstName: get('name').split(/\s+/)[0], emailed: result.emailed })
      if (isOpen) close()
      navigate('/thank-you/')
      return
    }
    // Fallback: the same details as a WhatsApp message, so the request can still reach the clinic.
    const waUrl = whatsappMessageHref(
      [
        'Hello NeoSculpt6, I would like to request a consultation.',
        `Name: ${get('name')}`,
        `Phone: ${get('phone')}`,
        get('email') && `Email: ${get('email')}`,
        get('service') && `Service: ${get('service')}`,
        get('doctor') && `Doctor: ${get('doctor')}`,
        get('date') && `Preferred date: ${get('date')}`,
        time && `Preferred time: ${time}`,
        `Consultation: ${get('type')}`,
      ].filter(Boolean) as string[],
    )
    setStatus({ state: 'error', message: failureMessage(result.error), waUrl })
  }

  // Clear a field's error as soon as the visitor edits it.
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as keyof Errors
    if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest)
  }

  return (
    // data-lead-form: the target BookingProvider's open() scrolls to when a page has its own form.
    <form data-lead-form onSubmit={onSubmit} onInput={onInput} noValidate className={`relative grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2 ${className}`}>
      <div className="min-w-0">
        <label htmlFor={id('name')} className={label}>
          Your Name <span aria-hidden="true">*</span>
        </label>
        <input
          id={id('name')}
          name="name"
          required
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy('name')}
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          className={field}
          data-autofocus={autoFocus || undefined}
        />
        {errors.name && (
          <p id={id('name-error')} className={errorText}>
            {errors.name}
          </p>
        )}
      </div>
      <div className="min-w-0">
        <label htmlFor={id('phone')} className={label}>
          Your Phone <span aria-hidden="true">*</span>
        </label>
        <input
          id={id('phone')}
          name="phone"
          type="tel"
          required
          aria-required="true"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy('phone')}
          autoComplete="tel"
          inputMode="tel"
          enterKeyHint="next"
          placeholder="Phone (WhatsApp)"
          className={field}
        />
        {errors.phone && (
          <p id={id('phone-error')} className={errorText}>
            {errors.phone}
          </p>
        )}
      </div>
      <div className="min-w-0 md:col-span-2">
        <label htmlFor={id('email')} className={label}>
          Your Email (optional)
        </label>
        <input
          id={id('email')}
          name="email"
          type="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy('email')}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="next"
          className={field}
        />
        {errors.email && (
          <p id={id('email-error')} className={errorText}>
            {errors.email}
          </p>
        )}
      </div>
      <div className="min-w-0">
        <label htmlFor={id('service')} className={label}>
          Service
        </label>
        <Select id={id('service')} name="service">
          <option value="" disabled>
            Select Service
          </option>
          {bookingServices.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div className="min-w-0">
        <label htmlFor={id('doctor')} className={label}>
          Doctor
        </label>
        <Select id={id('doctor')} name="doctor" defaultValue={defaultDoctor && bookingDoctors.includes(defaultDoctor) ? defaultDoctor : ''}>
          <option value="" disabled>
            Select Doctor
          </option>
          {bookingDoctors.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </Select>
      </div>
      <div className="min-w-0">
        <label htmlFor={id('date')} className={label}>
          Date
        </label>
        <div className="relative">
          <CalendarIcon className="pointer-events-none absolute top-1/2 left-5 size-[18px] -translate-y-1/2 text-secondary" />
          <input
            id={id('date')}
            name="date"
            type="date"
            min={minDate}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={describedBy('date')}
            className={`${field} min-w-0 pl-[50px] [color-scheme:dark]`}
          />
        </div>
        {errors.date && (
          <p id={id('date-error')} className={errorText}>
            {errors.date}
          </p>
        )}
      </div>
      <fieldset className="min-w-0">
        <legend className={label}>Time</legend>
        <div className="grid grid-cols-2 gap-3">
          <Select name="hour" ariaLabel="Hour">
            <option value="" disabled>
              Hour
            </option>
            {hours.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </Select>
          <Select name="minute" ariaLabel="Minute">
            <option value="" disabled>
              Min
            </option>
            {minutes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="min-w-0 md:col-span-2">
        <legend className={label}>Consultation Type</legend>
        <div className="grid grid-cols-2 gap-3">
          {['In clinic', 'Video'].map((t, i) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="flex h-[52px] items-center justify-center rounded-[7px] border border-border bg-border text-small text-text transition-colors duration-300 peer-checked:border-primary peer-checked:text-secondary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {/* Honeypot: hidden from people and screen readers, filled only by bots. A deliberately odd name so browser
          autofill (which would fill a "company" field) never touches it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input name="ns6_hp" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div className="min-w-0 md:col-span-2">
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending || undefined}
          className="w-full rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold text-secondary uppercase transition-colors duration-300 outline-offset-2 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-accent disabled:hover:text-secondary"
        >
          {sending ? 'Sending…' : 'Request My Consultation'}
        </button>
        <p className="mt-3 text-center max-md:text-left text-meta text-text" role="status">
          {status.state === 'sending' ? (
            'Sending your request…'
          ) : status.state === 'error' ? (
            <>
              {status.message} Call{' '}
              <a href={clinic.phoneHref} className="whitespace-nowrap text-secondary underline underline-offset-2 hover:text-primary focus-visible:text-primary">
                {clinic.phone}
              </a>{' '}
              or{' '}
              <a href={status.waUrl} target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-2 hover:text-primary focus-visible:text-primary">
                send your details on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          ) : (
            <>
              We’ll call or WhatsApp you within working hours. Your details stay private: see our{' '}
              {/* New tab, so a half-filled form (or the booking popup) isn't lost. */}
              <a href="/privacy-policy/" target="_blank" rel="noopener" className="text-secondary underline underline-offset-2 hover:text-primary focus-visible:text-primary">
                privacy policy<span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  )
}
