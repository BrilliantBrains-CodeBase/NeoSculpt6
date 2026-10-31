import type { TemplateProps } from '../components/PageShell'
import type { InternationalPatients, TechnologyHub } from '../data/technology/types'
import type { RoutePage } from '../data/types'
import type { SpecialityHub } from '../data/specialities/types'
import { LIVE, technologyByPath } from '../data/technology'
import { specialityByPath } from '../data/specialities'
import { testimonials } from '../data/home'
import { PagePlaceholder } from './PagePlaceholder'
import { TechnologyBanner } from '../components/technology/TechnologyBanner'
import { TechnologyCards } from '../components/technology/TechnologyCards'
import { TechnologyPathways } from '../components/technology/TechnologyPathways'
import { ServiceIntro } from '../components/service/ServiceIntro'
import { ServiceWhyChoose } from '../components/service/ServiceWhyChoose'
import { ServiceProcess } from '../components/service/ServiceProcess'
import { ServiceConsultation } from '../components/service/ServiceConsultation'
import { ServiceDoctor } from '../components/service/ServiceDoctor'
import { ServiceCost } from '../components/service/ServiceCost'
import { ServiceFaq } from '../components/service/ServiceFaq'
import { ServiceCta } from '../components/service/ServiceCta'
import { TestimonialsSection } from '../components/home/HomeTestimonials'
import { InstagramStrip } from '../components/InstagramStrip'
import { HubTreatments } from '../components/hub/HubTreatments'
import { HubConcerns } from '../components/hub/HubConcerns'
import { ResultsComingSoon } from '../components/results/ResultsComingSoon'

// Speciality hubs, /technology/, /international-patients/ and /results/ (the before/after gallery). New pages;
// meta in src/data/hubs.ts. /technology/ and /international-patients/ are built from
// content/technology/technology-international-patient.md (src/data/technology/); speciality hubs from
// src/data/specialities/ (the six speciality hubs); /results/ shows "coming soon" until the gallery is built;
// any other hub keeps the placeholder.
// `npm run verify` checks each page's section order against these ids.
export function HubTemplate({ page }: TemplateProps) {
  const content = LIVE.has(page.path) ? technologyByPath.get(page.path) : undefined
  if (content?.kind === 'technology-hub') return <TechnologyHubPage page={page} content={content} />
  if (content?.kind === 'international-patients') return <InternationalPage page={page} content={content} />
  const hub = specialityByPath.get(page.path)
  if (hub) return <SpecialityHubPage page={page} hub={hub} />
  if (page.path === '/results/') return <ResultsComingSoon page={page} />
  return <PagePlaceholder page={page} template="hub" />
}

// Hub: banner, the nine technology cards, the two doctors (an added section in the doc), the closing band.
function TechnologyHubPage({ page, content }: { page: RoutePage; content: TechnologyHub }) {
  return (
    <>
      <TechnologyBanner page={page} hero={content.hero} />
      <TechnologyCards cards={content.cards} />
      <ServiceDoctor doctors={content.doctors} />
      <ServiceCta closing={content.closing} />
      <InstagramStrip />
    </>
  )
}

// International Patients: a planning and travel page, in the doc's order. The three steps use the service pages'
// numbered open columns (ServiceWhyChoose), the patient journey the "How It Works" accordion, the estimates the
// cost-factor panel; there is no Explore panel (the doc gives none).
function InternationalPage({ page, content }: { page: RoutePage; content: InternationalPatients }) {
  return (
    <>
      <TechnologyBanner page={page} hero={content.hero} />
      <ServiceIntro intro={content.intro} />
      <ServiceWhyChoose whyChoose={{ h2: content.steps.h2, subline: null, cards: content.steps.cards }} />
      <TechnologyPathways pathways={content.pathways} />
      <ServiceProcess id="patient-journey" process={content.journey} />
      <ServiceConsultation consultation={content.travel} />
      <ServiceDoctor doctors={content.doctors} />
      <ServiceCost cost={content.estimates} />
      <TestimonialsSection
        id="success-stories"
        eyebrow={content.reviews.eyebrow}
        h2={[{ text: content.reviews.h2 }]}
        reviews={content.reviews.items}
        rating={testimonials.rating}
      />
      <ServiceFaq faqs={content.faqs} />
      <ServiceCta closing={content.closing} />
      <InstagramStrip />
    </>
  )
}

// Speciality hub (brief: content/service/prompts/speciality-<hub>.md): banner, intro, every treatment in groups, the
// concern cards, the assessment process, the doctor, the speciality's technology, cost guidance, success stories,
// FAQs, the closing band and the Instagram row. Order in hub.order (checked by `npm run verify`). The technology
// section is left out where the technology doc has nothing for the speciality; two doctors sit side by side.
function SpecialityHubPage({ page, hub }: { page: RoutePage; hub: SpecialityHub }) {
  return (
    <>
      <TechnologyBanner page={page} hero={hub.hero} />
      <ServiceIntro intro={hub.intro} />
      <HubTreatments treatments={hub.treatments} />
      <HubConcerns concerns={hub.concerns} />
      <ServiceProcess process={hub.process} />
      <ServiceDoctor doctors={hub.doctors.cards.length > 1 ? { ...hub.doctors, columns: true } : hub.doctors} />
      {hub.technology.cards.length > 0 && <TechnologyCards id="hub-technology" cards={hub.technology.cards} heading={hub.technology} />}
      <ServiceCost cost={hub.cost} />
      <TestimonialsSection id="success-stories" h2={[{ text: hub.reviews.h2 }]} reviews={hub.reviews.items} rating={testimonials.rating} />
      <ServiceFaq faqs={hub.faqs} />
      <ServiceCta closing={hub.closing} />
      <InstagramStrip />
    </>
  )
}
