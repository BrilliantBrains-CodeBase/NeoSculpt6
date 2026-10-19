import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Doctor profiles: /about-dr-sandeep-mahapatra/ (old copy in page.oldSite) and /dr-saranya-t/ (new).
export function DoctorTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="doctor" />
}
