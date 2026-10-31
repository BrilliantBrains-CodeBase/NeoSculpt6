import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { contact, durations, genders, photoSteps, treatments, type Gender, type PhotoStep, type PhotoView } from '../../data/assessment'
import { clinic } from '../../data/site'
import { getAttribution } from '../../lib/attribution'
import { submitAssessment, type AssessmentReport } from '../../lib/lead'
import { MAX_INPUT_BYTES, resizePhoto, type ResizedPhoto } from '../../lib/resizeImage'
import { phoneError, whatsappMessageHref } from '../booking/whatsapp'
import { ArrowLeftIcon, ArrowRightIcon } from '../icons'
import { button, eyebrow, outlineButton } from '../shared'
import { PendingView, ReportView } from './AssessmentResultView'
import { PhotoGuide } from './PhotoGuide'

// The free AI hair assessment, one question per screen, after the visitor presses Start (AssessmentTemplate). Same
// order as the sister site's chat: age, gender, then guided photos; plus two optional questions and the contact step.
// Photos are shrunk in the browser (lib/resizeImage.ts) and everything is sent once, at the end, to the Apps Script
// backend (lib/lead.ts submitAssessment → apps-script/Assessment.gs), which answers with the report.
// Each new step moves focus to its heading, so keyboard and screen reader users follow along.

const label = 'mb-2 block type-accent font-medium text-secondary uppercase'
const field =
  'block h-[52px] w-full rounded-[7px] border border-border bg-border px-5 text-small text-text placeholder:text-text/70 transition-colors duration-300 outline-none focus:border-primary focus-visible:border-primary aria-invalid:border-primary'
const errorText = 'mt-2 text-meta text-primary'
const chip =
  'flex min-h-[52px] items-center rounded-[7px] border border-border bg-border px-5 py-3 text-small text-text transition-colors duration-300 peer-checked:border-primary peer-checked:text-secondary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary hover:border-primary/60'
const backLink =
  'inline-flex items-center gap-2 text-button font-semibold text-text uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary'

type Step = 'age' | 'gender' | 'duration' | 'treatment' | `photo:${PhotoView}` | 'contact'
type Phase =
  | { name: 'form' }
  | { name: 'sending' }
  | { name: 'done'; report: AssessmentReport; emailed: boolean }
  | { name: 'pending'; timedOut: boolean }
  | { name: 'error'; message: string }

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

function Choice({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {options.map((o) => (
        <label key={o} className="cursor-pointer">
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="peer sr-only" />
          <span className={chip}>{o}</span>
        </label>
      ))}
    </div>
  )
}

export function AssessmentWizard() {
  const uid = useId()
  const id = (n: string) => `${uid}-${n}`
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mountedAt = useRef(Date.now())

  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [duration, setDuration] = useState('')
  const [treatment, setTreatment] = useState('')
  const [photos, setPhotos] = useState<Partial<Record<PhotoView, ResizedPhoto>>>({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busyPhoto, setBusyPhoto] = useState(false)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>({ name: 'form' })

  const shots: PhotoStep[] = gender ? photoSteps[gender] : photoSteps.Male
  const steps: Step[] = ['age', 'gender', 'duration', 'treatment', ...shots.map((s) => `photo:${s.view}` as const), 'contact']
  const step = steps[Math.min(index, steps.length - 1)]

  // Focus the new step's heading (or the result) and bring the card into view when its top is off screen.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
    const el = rootRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top < 0 || top > window.innerHeight * 0.6) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    }
  }, [index, phase.name])

  const next = () => {
    setErrors({})
    setIndex((i) => Math.min(i + 1, steps.length - 1))
  }
  const back = () => {
    setErrors({})
    setIndex((i) => Math.max(i - 1, 0))
  }

  const onAge = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(age)
    if (!age || !Number.isInteger(n)) return setErrors({ age: 'Please enter your age in years, for example 28.' })
    if (n < 18) return setErrors({ age: 'This assessment is for adults, 18 and over. Please call us and we’ll help.' })
    if (n > 90) return setErrors({ age: 'Please check your age and try again.' })
    next()
  }

  const onPhoto = async (view: PhotoView, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_INPUT_BYTES) return setErrors({ photo: 'That photo is too large. Please choose one under 20 MB.' })
    setBusyPhoto(true)
    setErrors({})
    try {
      const resized = await resizePhoto(file)
      setPhotos((p) => ({ ...p, [view]: resized }))
    } catch {
      setErrors({ photo: 'We couldn’t read that photo. Please take a new one, or choose a JPEG or PNG.' })
    } finally {
      setBusyPhoto(false)
    }
  }

  const send = async () => {
    setPhase({ name: 'sending' })
    const result = await submitAssessment({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: Number(age),
      gender,
      duration,
      treatment,
      consent,
      photos: shots.filter((s) => photos[s.view]).map((s) => ({ view: s.view, data: photos[s.view]!.base64 })),
      source: 'hair-assessment',
      ...getAttribution(),
      elapsedMs: Date.now() - mountedAt.current,
      hp,
    })
    if (result.ok && result.status === 'done') setPhase({ name: 'done', report: result.report, emailed: result.emailed })
    else if (result.ok) setPhase({ name: 'pending', timedOut: false })
    else if (result.error === 'timeout') setPhase({ name: 'pending', timedOut: true })
    else if (result.error === 'rate_limited')
      setPhase({ name: 'error', message: 'We already have an assessment from this number and will be in touch soon.' })
    else setPhase({ name: 'error', message: 'We couldn’t send your assessment just now. Please try again in a moment, or reach us directly.' })
  }

  const onContact = (e: FormEvent) => {
    e.preventDefault()
    const found: Record<string, string> = {}
    if (!name.trim()) found.name = 'Please enter your name.'
    const pe = phoneError(phone)
    if (pe) found.phone = pe
    if (!email.trim()) found.email = 'Please enter your email, so we can send your report.'
    else if (!emailOk(email.trim())) found.email = 'Please enter a valid email, for example name@example.com.'
    if (!consent) found.consent = 'Please tick the box so we can analyse your photos.'
    setErrors(found)
    const first = ['name', 'phone', 'email', 'consent'].find((k) => found[k])
    if (first) {
      document.getElementById(id(first))?.focus()
      return
    }
    void send()
  }

  const heading = (text: ReactNode) => (
    <h2 ref={headingRef} tabIndex={-1} className="font-heading text-h4 text-secondary uppercase outline-none">
      {text}
    </h2>
  )

  // Result screens ---------------------------------------------------------------------------------------------
  if (phase.name === 'sending') {
    return (
      <div ref={rootRef} className="flex scroll-mt-[calc(var(--header-offset)+1rem)] flex-col gap-5" aria-busy="true">
        {heading('Analysing your photos…')}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
          <div className="h-full w-1/3 animate-[ns6-progress_1.6s_ease-in-out_infinite] rounded-full bg-primary motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-60" />
        </div>
        <p role="status">This usually takes under a minute. Please keep this page open.</p>
      </div>
    )
  }
  if (phase.name === 'done' || phase.name === 'pending') {
    return (
      <div ref={rootRef} className="flex scroll-mt-[calc(var(--header-offset)+1rem)] flex-col gap-6">
        {heading(phase.name === 'done' ? 'Your Hair Assessment' : 'Thank You')}
        {phase.name === 'done' ? (
          <ReportView report={phase.report} email={email.trim()} emailed={phase.emailed} />
        ) : (
          <PendingView timedOut={phase.timedOut} />
        )}
      </div>
    )
  }

  // Form steps -------------------------------------------------------------------------------------------------
  const shot = step.startsWith('photo:') ? shots.find((s) => `photo:${s.view}` === step)! : null
  const nav = (nextControl: ReactNode) => (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      {index > 0 ? (
        <button type="button" onClick={back} className={backLink}>
          <ArrowLeftIcon className="size-3.5 shrink-0" />
          Back
        </button>
      ) : (
        <span />
      )}
      {nextControl}
    </div>
  )
  const nextButton = (text = 'Next', type: 'submit' | 'button' = 'submit', onClick?: () => void, disabled = false) => (
    <button type={type} onClick={onClick} disabled={disabled} className={`${button} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60`}>
      {text}
      <ArrowRightIcon className="size-3.5 shrink-0" />
    </button>
  )

  return (
    <div ref={rootRef} className="flex scroll-mt-[calc(var(--header-offset)+1rem)] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className={eyebrow}>
          Step {index + 1} of {steps.length}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      {step === 'age' && (
        <form onSubmit={onAge} noValidate className="flex flex-col gap-5">
          {heading(<label htmlFor={id('age')}>May I know your age?</label>)}
          <div className="max-w-[240px]">
            <input
              id={id('age')}
              type="number"
              inputMode="numeric"
              min={18}
              max={90}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 28"
              aria-invalid={errors.age ? true : undefined}
              aria-describedby={errors.age ? id('age-error') : undefined}
              className={field}
            />
          </div>
          {errors.age && (
            <p id={id('age-error')} className={errorText}>
              {errors.age}
            </p>
          )}
          {nav(nextButton())}
        </form>
      )}

      {step === 'gender' && (
        <fieldset className="flex flex-col gap-5">
          <legend className="contents">{heading('What is your gender?')}</legend>
          <p>Hair loss is graded differently for men and women, so the photos we ask for differ too.</p>
          <Choice
            name="gender"
            options={genders}
            value={gender}
            onChange={(v) => {
              setGender(v as Gender)
              next()
            }}
          />
          {nav(gender ? nextButton('Next', 'button', next) : null)}
        </fieldset>
      )}

      {step === 'duration' && (
        <fieldset className="flex flex-col gap-5">
          <legend className="contents">{heading('How long have you noticed hair loss?')}</legend>
          <Choice name="duration" options={durations} value={duration} onChange={setDuration} />
          {nav(nextButton(duration ? 'Next' : 'Skip', 'button', next))}
        </fieldset>
      )}

      {step === 'treatment' && (
        <fieldset className="flex flex-col gap-5">
          <legend className="contents">{heading('Have you tried any treatment so far?')}</legend>
          <Choice name="treatment" options={treatments} value={treatment} onChange={setTreatment} />
          {nav(nextButton(treatment ? 'Next' : 'Skip', 'button', next))}
        </fieldset>
      )}

      {shot && (
        <div className="flex flex-col gap-5">
          {heading(
            <>
              Photo {shots.indexOf(shot) + 1} of {shots.length}: {shot.title}
            </>,
          )}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_200px] md:items-start">
            <div className="flex flex-col gap-4">
              <p className="font-medium text-secondary">Follow the quick guide:</p>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-primary">
                {shot.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center rounded-[20px] border border-border bg-alternate p-4 max-md:max-w-[200px]">
              {photos[shot.view] ? (
                <img src={photos[shot.view]!.dataUrl} alt={`Your photo: ${shot.title.toLowerCase()}`} className="aspect-square w-full rounded-[12px] object-cover" />
              ) : (
                <PhotoGuide view={shot.view} className="size-[150px]" />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${photos[shot.view] ? outlineButton : button} cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void onPhoto(shot.view, e)}
                disabled={busyPhoto}
                aria-describedby={errors.photo ? id('photo-error') : undefined}
                className="sr-only"
              />
              {busyPhoto ? 'Preparing photo…' : photos[shot.view] ? 'Retake Photo' : 'Take or Choose a Photo'}
            </label>
            <p className="text-meta">One clear photo, up to 20 MB.</p>
          </div>
          {errors.photo && (
            <p id={id('photo-error')} className={errorText} role="alert">
              {errors.photo}
            </p>
          )}
          {nav(
            photos[shot.view]
              ? nextButton('Next', 'button', next, busyPhoto)
              : shot.optional
                ? nextButton('Skip This Photo', 'button', next, busyPhoto)
                : null,
          )}
          {shot.optional && !photos[shot.view] && <p className="text-meta">Can’t take this one alone? Skip it: your doctor will check this area at your consultation.</p>}
        </div>
      )}

      {step === 'contact' && (
        <form onSubmit={onContact} noValidate className="relative flex flex-col gap-5">
          {heading(contact.heading)}
          <p>{contact.lede}</p>
          <div className="grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={id('name')} className={label}>
                Your Name <span aria-hidden="true">*</span>
              </label>
              <input
                id={id('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoCapitalize="words"
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? id('name-error') : undefined}
                className={field}
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
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="Phone (WhatsApp)"
                aria-required="true"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? id('phone-error') : undefined}
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
                Your Email <span aria-hidden="true">*</span>
              </label>
              <input
                id={id('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="off"
                spellCheck={false}
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? id('email-error') : undefined}
                className={field}
              />
              {errors.email && (
                <p id={id('email-error')} className={errorText}>
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id={id('consent')}
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? id('consent-error') : undefined}
                className="mt-1 size-5 shrink-0 cursor-pointer accent-primary"
              />
              <span className="text-small">
                {contact.consent} See our{' '}
                <a href="/privacy-policy/" target="_blank" rel="noopener" className="text-secondary underline underline-offset-2 hover:text-primary focus-visible:text-primary">
                  privacy policy<span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </span>
            </label>
            {errors.consent && (
              <p id={id('consent-error')} className={errorText}>
                {errors.consent}
              </p>
            )}
          </div>
          {/* Honeypot, as on BookingForm: filled only by bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Leave this empty
              <input name="ns6_hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </label>
          </div>
          {phase.name === 'error' && (
            <p role="alert" className="rounded-[7px] border border-primary/60 px-5 py-4 text-small">
              {phase.message} Call{' '}
              <a href={clinic.phoneHref} className="whitespace-nowrap text-secondary underline underline-offset-2 hover:text-primary">
                {clinic.phone}
              </a>{' '}
              or{' '}
              <a
                href={whatsappMessageHref([
                  'Hello NeoSculpt6, I tried the free AI hair assessment on your website.',
                  `Name: ${name.trim()}`,
                  `Age: ${age}`,
                  gender && `Gender: ${gender}`,
                ].filter(Boolean) as string[])}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline underline-offset-2 hover:text-primary"
              >
                message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>{' '}
              and send your photos there.
            </p>
          )}
          {nav(nextButton(phase.name === 'error' ? 'Try Again' : 'Get My Report'))}
        </form>
      )}
    </div>
  )
}
