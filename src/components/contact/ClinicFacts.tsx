import type { ReactNode } from 'react'
import { clinic } from '../../data/site'

// Labelled clinic facts for the Contact page (form sidebar and map card), styled like the Rejuvita contacts page's
// "ADDRESS: / OPEN:" columns. Every value comes from site.ts. Rendered as a description list inside <address>.

type Fact = 'address' | 'landmark' | 'hours' | 'phone' | 'email'

const link = 'text-secondary underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline'
const { address } = clinic

const facts: Record<Fact, { label: string; value: ReactNode }> = {
  address: {
    label: 'Address',
    value: `${address.streetAddress}, ${address.addressLocality} ${address.postalCode}`,
  },
  landmark: { label: 'Landmark', value: address.landmark },
  hours: { label: 'Open', value: clinic.hours.label },
  phone: {
    label: 'Phone',
    value: (
      <a href={clinic.phoneHref} className={`${link} whitespace-nowrap`}>
        {clinic.phone}
      </a>
    ),
  },
  email: {
    label: 'Email',
    value: (
      <a href={`mailto:${clinic.email}`} className={`${link} break-all`}>
        {clinic.email}
      </a>
    ),
  },
}

// `columns={1}` keeps one column at every width (the narrow form sidebar).
export function ClinicFacts({ show, columns = 2, className = '' }: { show: Fact[]; columns?: 1 | 2; className?: string }) {
  const two = columns === 2
  return (
    <address className={`not-italic ${className}`}>
      <dl className={`grid grid-cols-1 gap-x-10 gap-y-[25px] ${two ? 'md:grid-cols-2' : ''}`}>
        {show.map((key) => (
          <div key={key} className={`min-w-0 ${two && key === 'address' ? 'md:col-span-2' : ''}`}>
            <dt className="mb-2 type-accent font-semibold text-secondary uppercase">{facts[key].label}:</dt>
            <dd className="text-small text-text">{facts[key].value}</dd>
          </div>
        ))}
      </dl>
    </address>
  )
}
