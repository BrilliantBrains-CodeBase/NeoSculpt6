import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Speciality hubs, /technology/, /international-patients/ and /results/ (the before/after gallery). New pages;
// meta drafts in src/data/hubs.ts.
export function HubTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="hub" />
}
