import type { ReactNode } from 'react'
import { result as copy } from '../../data/assessment'
import { clinic } from '../../data/site'
import type { AssessmentReport } from '../../lib/lead'
import { useBooking } from '../booking/BookingContext'
import { SmartLink } from '../SmartLink'
import { PhoneIcon, WhatsAppIcon } from '../icons'
import { button, eyebrow, outlineButton } from '../shared'

// The hair assessment's last screen (AssessmentWizard): the AI report the backend sent back, or the "our team has your
// photos" message when the AI step is still pending. Always ends with the disclaimer and the ways to book or talk.

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const linkClass = 'text-primary underline underline-offset-4 hover:text-tertiary focus-visible:text-tertiary'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4 md:grid md:grid-cols-[180px_1fr] md:gap-6">
      <dt className="font-medium text-secondary">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function NextSteps() {
  const { open } = useBooking()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={open} className={button}>
        Book a Consultation
      </button>
      <a href={clinic.phoneHref} className={`${outlineButton} inline-flex items-center gap-2`}>
        <PhoneIcon />
        Call {clinic.phone}
      </a>
      <SmartLink href={clinic.whatsappHref} className="inline-flex items-center gap-2 text-small font-medium text-secondary underline-offset-4 hover:text-primary hover:underline focus-visible:text-primary">
        <WhatsAppIcon />
        WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
      </SmartLink>
    </div>
  )
}

export function ReportView({ report, email, emailed }: { report: AssessmentReport; email: string; emailed: boolean }) {
  const graded = report.scale !== 'Unclear' && report.grade
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className={eyebrow}>Your preliminary result</p>
        <p className="font-heading text-h3 text-secondary uppercase">
          {graded ? (
            <>
              {report.scale} <span className="text-tertiary">{report.grade}</span>
            </>
          ) : (
            'Grade not clear from the photos'
          )}
        </p>
        {graded && <p className="text-meta">Estimated from your photos · {report.confidence} confidence</p>}
        <p className="text-secondary">{report.summary}</p>
      </div>

      {report.photoIssues.length > 0 && (
        <div className="rounded-[7px] border border-primary/60 px-5 py-4">
          <p className="font-medium text-secondary">About your photos</p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 marker:text-primary">
            {report.photoIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <dl className="border-t border-border">
        {report.pattern && <Row label="Pattern">{report.pattern}</Row>}
        {report.density && <Row label="Density">{report.density}</Row>}
        {report.donor && <Row label="Donor area">{report.donor}</Row>}
        {report.grafts && (
          <Row label="Grafts (estimate)">
            About {report.grafts.min.toLocaleString('en-IN')}–{report.grafts.max.toLocaleString('en-IN')} grafts, if a transplant suits you.
          </Row>
        )}
        {report.cost && (
          <Row label="Approximate cost">
            {inr(report.cost.min)}–{inr(report.cost.max)}. Your doctor confirms the final plan and cost at consultation.
          </Row>
        )}
      </dl>

      {report.options.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-heading text-h5 text-secondary uppercase">Options worth discussing</h3>
          <ul className="flex flex-col gap-3">
            {report.options.map((o) => (
              <li key={o.href} className="rounded-[7px] border border-border px-5 py-4">
                {o.href.startsWith('/') ? (
                  <SmartLink href={o.href} className={`${linkClass} font-medium`}>
                    {o.label}
                  </SmartLink>
                ) : (
                  <span className="font-medium text-secondary">{o.label}</span>
                )}
                <p className="mt-1">{o.why}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.nextSteps && <p className="text-secondary">{report.nextSteps}</p>}
      {emailed && (
        <p>
          A copy of this report is on its way to <span className="text-secondary [overflow-wrap:anywhere]">{email}</span>. If you can’t see it, check your spam folder.
        </p>
      )}
      <p className="text-meta">{copy.disclaimer}</p>
      <NextSteps />
    </div>
  )
}

export function PendingView({ timedOut }: { timedOut: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-heading text-h3 text-secondary uppercase">{copy.pendingHeading}</p>
      <p className="text-secondary">
        {timedOut
          ? 'This is taking longer than usual. Your report is still being prepared and will reach you by email. If it hasn’t arrived within the hour, please call us.'
          : copy.pending}
      </p>
      <p className="text-meta">{copy.disclaimer}</p>
      <NextSteps />
    </div>
  )
}
