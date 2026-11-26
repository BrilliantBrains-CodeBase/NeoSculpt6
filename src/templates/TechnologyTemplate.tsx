import type { TemplateProps } from '../components/PageShell'
import type { ArtasDetail, TechnologyDetail } from '../data/technology/types'
import { LIVE, technologyByPath } from '../data/technology'
import { testimonials } from '../data/home'
import { PagePlaceholder } from './PagePlaceholder'
import { TechnologyBanner } from '../components/technology/TechnologyBanner'
import { TechnologyHighlight } from '../components/technology/TechnologyHighlight'
import { TechnologyBenefits } from '../components/technology/TechnologyBenefits'
import { InfoSection } from '../components/InfoSection'
import { PageDisclaimer } from '../components/PageDisclaimer'
import { TechnologyExplore } from '../components/technology/TechnologyExplore'
import { ServiceIntro } from '../components/service/ServiceIntro'
import { ServiceConsultation } from '../components/service/ServiceConsultation'
import { ServiceProcess } from '../components/service/ServiceProcess'
import { ServiceCandidates } from '../components/service/ServiceCandidates'
import { ServiceDoctor } from '../components/service/ServiceDoctor'
import { ServiceCost } from '../components/service/ServiceCost'
import { ServiceFaq } from '../components/service/ServiceFaq'
import { ServiceCta } from '../components/service/ServiceCta'
import { TestimonialsSection } from '../components/home/HomeTestimonials'
import { InstagramStrip } from '../components/InstagramStrip'

// Technology pages under /technology/. Content and section order: content/technology/technology-international-patient.md
// (the 13 sections of a technology page, plus its sidebar; ARTAS has its own list), parsed into
// src/data/technology/parsed.json and assembled in src/data/technology/index.ts. A page not in LIVE keeps the
// placeholder. Sections shaped like a service page section reuse the service component (one design across both page
// types); the ones the service pages lack are in components/technology/. The doc's sidebar is the Explore panel below
// the closing band (the boilerplate keeps the CTA above Explore, Instagram and the footer). The footer is the
// site-wide SiteFooter. `npm run verify` checks the section order against these ids.
export function TechnologyTemplate({ page }: TemplateProps) {
  const content = technologyByPath.get(page.path)
  if (!content || !LIVE.has(page.path) || (content.kind !== 'technology-detail' && content.kind !== 'artas-detail')) {
    return <PagePlaceholder page={page} template="technology" />
  }

  // ARTAS (client brief 2026-11-25): hero, intro, how it works, benefits, the ARTAS vs FUT vs manual FUE table,
  // candidates, results, doctor, cost, FAQs, closing band, disclaimer, Explore; no reviews.
  // The others: hero, intro, how it is different, assessment band, benefits, how it works, candidates, expectations.
  if (content.kind === 'artas-detail') return <ArtasPage page={page} content={content} />
  return (
    <>
      <TechnologyBanner page={page} hero={content.hero} />
      <ServiceIntro intro={content.intro} />
      <StandardMiddle content={content} />
      <ServiceIntro id="technology-expectations" intro={{ ...content.expectations, points: [] }} />
      <ServiceDoctor doctors={content.doctors} />
      <ServiceCost cost={content.cost} />
      <TestimonialsSection
        id="success-stories"
        eyebrow={content.reviews.eyebrow}
        h2={[{ text: content.reviews.h2 }]}
        reviews={content.reviews.items}
        rating={testimonials.rating}
      />
      <ServiceFaq faqs={content.faqs} />
      <ServiceCta closing={content.closing} />
      <TechnologyExplore explore={content.explore} />
      <InstagramStrip />
    </>
  )
}

function StandardMiddle({ content }: { content: TechnologyDetail }) {
  return (
    <>
      <ServiceConsultation consultation={content.different} />
      <TechnologyHighlight assessment={content.assessment} />
      <TechnologyBenefits benefits={content.benefits} />
      <ServiceProcess id="how-it-works" process={content.process} />
      <ServiceCandidates candidates={content.candidates} />
    </>
  )
}

function ArtasPage({ page, content }: { page: TemplateProps['page']; content: ArtasDetail }) {
  return (
    <>
      <TechnologyBanner page={page} hero={content.hero} />
      <ServiceIntro intro={content.intro} />
      <ServiceProcess id="how-it-works" process={content.process} />
      <TechnologyBenefits benefits={content.benefits} />
      <InfoSection block={content.comparison} />
      <ServiceCandidates candidates={content.candidates} />
      <ServiceIntro id="technology-expectations" intro={{ ...content.expectations, points: [] }} />
      <ServiceDoctor doctors={content.doctors} />
      <ServiceCost cost={content.cost} />
      <ServiceFaq faqs={content.faqs} />
      <ServiceCta closing={content.closing} />
      <PageDisclaimer text={content.disclaimer} />
      <TechnologyExplore explore={content.explore} />
      <InstagramStrip />
    </>
  )
}
