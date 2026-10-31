import type { ComponentType } from 'react'
import type { RoutePage, PageType } from '../data/types'
import { Seo } from './Seo'
import { HomeTemplate } from '../templates/HomeTemplate'
import { AboutTemplate } from '../templates/AboutTemplate'
import { ServiceTemplate } from '../templates/ServiceTemplate'
import { TechnologyTemplate } from '../templates/TechnologyTemplate'
import { HubTemplate } from '../templates/HubTemplate'
import { DoctorTemplate } from '../templates/DoctorTemplate'
import { ContactTemplate } from '../templates/ContactTemplate'
import { JournalTemplate } from '../templates/JournalTemplate'
import { JournalArticleTemplate } from '../templates/JournalArticleTemplate'
import { LegacyTemplate } from '../templates/LegacyTemplate'
import { LegalTemplate } from '../templates/LegalTemplate'
import { ThankYouTemplate } from '../templates/ThankYouTemplate'

export interface TemplateProps {
  page: RoutePage
}

const templates: Record<PageType, ComponentType<TemplateProps>> = {
  home: HomeTemplate,
  about: AboutTemplate,
  service: ServiceTemplate,
  technology: TechnologyTemplate,
  hub: HubTemplate,
  doctor: DoctorTemplate,
  contact: ContactTemplate,
  journal: JournalTemplate,
  article: JournalArticleTemplate,
  legal: LegalTemplate,
  'thank-you': ThankYouTemplate,
  'legacy-demo': LegacyTemplate,
}

export function PageShell({ page }: TemplateProps) {
  const Template = templates[page.type]
  return (
    <>
      <Seo page={page} />
      <Template page={page} />
    </>
  )
}
