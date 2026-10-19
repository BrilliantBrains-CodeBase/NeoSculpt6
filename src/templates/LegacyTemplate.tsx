import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Leftover theme-demo URLs from the old WordPress install. Kept so no old URL 404s; noindex and out of the sitemap.
export function LegacyTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="legacy-demo" />
}
