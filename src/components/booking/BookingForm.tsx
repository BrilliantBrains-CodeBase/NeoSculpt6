import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { clinic } from '../../data/site'
import { bookingDoctors, bookingServices } from '../../data/nav'
import { CalendarIcon, ChevronDownIcon } from '../icons'

// The theme's Forminator appointment form (popup 135 / home "Make an appointment"), with the NeoSculpt6
// fields from homepage.md section 12. Shared by BookingDialog and, later, the home page booking section.
// No form backend yet: submitting opens WhatsApp with the details filled in.

const label = 'mb-2 block type-accent font-medium text-secondary uppercase'
const field =
  'block h-[52px] w-full rounded-[7px] border border-border bg-border px-5 text-small text-text placeholder:text-text/70 transition-colors duration-300 outline-none focus:border-primary'
const hours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18']
const minutes = ['00', '15', '30', '45']

function Select({ id, name, required, children, ariaLabel }: { id?: string; name: string; required?: boolean; children: ReactNode; ariaLabel?: string }) {
  return (
    <div className="relative">
      <select id={id} name={name} required={required} aria-label={ariaLabel} defaultValue="" className={`${field} cursor-pointer appearance-none pr-12`}>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-5 size-2.5 -translate-y-1/2 text-secondary" />
    </div>
  )
}

export function BookingForm({ className = '' }: { className?: string }) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const [sent, setSent] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    const time = get('hour') ? `${get('hour')}:${get('minute') || '00'}` : ''
    const lines = [
      'Hello NeoSculpt6, I would like to request a consultation.',
      `Name: ${get('name')}`,
      `Phone: ${get('phone')}`,
      get('service') && `Service: ${get('service')}`,
      get('doctor') && `Doctor: ${get('doctor')}`,
      get('date') && `Preferred date: ${get('date')}${time ? ` at ${time}` : ''}`,
      `Consultation: ${get('type')}`,
    ].filter(Boolean)
    window.open(`${clinic.whatsappHref}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <form onSubmit={onSubmit} className={`grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2 ${className}`}>
      <div>
        <label htmlFor={id('name')} className={label}>
          Your Name <span aria-hidden="true">*</span>
        </label>
        <input id={id('name')} name="name" required autoComplete="name" className={field} data-autofocus />
      </div>
      <div>
        <label htmlFor={id('phone')} className={label}>
          Your Phone <span aria-hidden="true">*</span>
        </label>
        <input
          id={id('phone')}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          pattern="[+0-9 ()\-]{10,}"
          title="Phone or WhatsApp number, at least 10 digits"
          placeholder="Phone (WhatsApp)"
          className={field}
        />
      </div>
      <div>
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
      <div>
        <label htmlFor={id('doctor')} className={label}>
          Doctor
        </label>
        <Select id={id('doctor')} name="doctor">
          <option value="" disabled>
            Select Doctor
          </option>
          {bookingDoctors.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor={id('date')} className={label}>
          Date
        </label>
        <div className="relative">
          <CalendarIcon className="pointer-events-none absolute top-1/2 left-5 size-[18px] -translate-y-1/2 text-secondary" />
          <input id={id('date')} name="date" type="date" min={today} className={`${field} pl-[50px] [color-scheme:dark]`} />
        </div>
      </div>
      <fieldset>
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
      <fieldset className="md:col-span-2">
        <legend className={label}>Consultation Type</legend>
        <div className="grid grid-cols-2 gap-3">
          {['In clinic', 'Video'].map((t, i) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="flex h-[52px] items-center justify-center rounded-[7px] border border-border bg-border text-small text-text transition-colors duration-300 peer-checked:border-primary peer-checked:text-secondary peer-focus-visible:outline-2 peer-focus-visible:outline-primary">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
        >
          Request My Consultation
        </button>
        <p className="mt-3 text-center text-meta text-text" role="status">
          {sent
            ? 'WhatsApp has opened with your details. Send the message and we’ll confirm your time.'
            : 'We’ll call or WhatsApp you within working hours. Your details stay private.'}
        </p>
      </div>
    </form>
  )
}
