import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Treatment pages. Old copy for each page: page.oldSite.dataJson (sections, faqs, images) and contentMd.
export function ServiceTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="service" />
}
