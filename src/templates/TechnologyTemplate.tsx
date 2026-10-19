import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Technology pages under /technology/. Five were 404 on the old site, so they have no old copy (page.oldSite.status).
export function TechnologyTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="technology" />
}
