import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Contact Us. Address, hours and phone: src/data/site.ts.
export function ContactTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="contact" />
}
