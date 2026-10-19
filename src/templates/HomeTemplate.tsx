import type { TemplateProps } from '../components/PageShell'
import { PagePlaceholder } from './PagePlaceholder'

// Home page. Content and section order: content/home-page/homepage.md.
export function HomeTemplate({ page }: TemplateProps) {
  return <PagePlaceholder page={page} template="home" />
}
