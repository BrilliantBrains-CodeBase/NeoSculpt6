import type { TemplateProps } from '../components/PageShell'
import { servicesByPath } from '../data/services'
import { PagePlaceholder } from './PagePlaceholder'
import { ServiceHero } from '../components/service/ServiceHero'
import { ServiceIntro } from '../components/service/ServiceIntro'
import { ServiceConsultation } from '../components/service/ServiceConsultation'
import { ServiceWhyChoose } from '../components/service/ServiceWhyChoose'
import { ServiceProcess } from '../components/service/ServiceProcess'
import { ServiceCandidates } from '../components/service/ServiceCandidates'
import { ServiceDoctor } from '../components/service/ServiceDoctor'
import { ServiceTechnology } from '../components/service/ServiceTechnology'
import { ServiceCost } from '../components/service/ServiceCost'
import { ServiceStrip } from '../components/service/ServiceStrip'
import { TestimonialsSection } from '../components/home/HomeTestimonials'
import { testimonials } from '../data/home'
import { ServiceFaq } from '../components/service/ServiceFaq'
import { ServiceSidebar } from '../components/service/ServiceSidebar'
import { ServiceCta } from '../components/service/ServiceCta'
import { InstagramStrip } from '../components/InstagramStrip'

// Treatment pages. Content and section order: content/service/service-page.md (the 13 sections, plus the sidebar),
// parsed into src/data/services/parsed.json and assembled in src/data/services/index.ts. A service route missing from
// the doc would keep the placeholder (its old copy: page.oldSite.dataJson and contentMd in pages.json).
// Layout follows the Rejuvita service page (services__rhinoplasty): one column of full-width sections, centred
// titles, a 1400px content width. The doc's sidebar is a full-width "Explore" panel after the FAQs (ServiceSidebar),
// so the closing CTA stays directly above the Instagram row. The footer is the site-wide SiteFooter.
// `npm run verify` checks the section order against these ids.
export function ServiceTemplate({ page }: TemplateProps) {
  const content = servicesByPath.get(page.path)
  if (!content) return <PagePlaceholder page={page} template="service" />

  return (
    <>
      <ServiceHero page={page} hero={content.hero} />
      <ServiceIntro intro={content.intro} />
      <ServiceConsultation consultation={content.consultation} />
      <ServiceWhyChoose whyChoose={content.whyChoose} />
      <ServiceProcess process={content.process} />
      <ServiceCandidates candidates={content.candidates} />
      <ServiceDoctor doctors={content.doctors} />
      <ServiceTechnology technology={content.technology} />
      <ServiceCost cost={content.cost} />

      {content.strips.length > 0 && (
        // Two strips (10a, 10b) sit side by side; a single one takes a centred column rather than half the row.
        <div
          className={`mx-auto mb-20 grid w-full grid-cols-1 gap-[50px] px-5 md:mb-[100px] md:gap-[60px] md:px-[30px] xl:mb-[150px] xl:gap-[80px] xl:px-10 ${
            content.strips.length > 1 ? 'max-w-[1400px] md:grid-cols-2' : 'max-w-[980px]'
          }`}
        >
          {content.strips.map((strip, i) => (
            <ServiceStrip key={strip.heading} strip={strip} index={i} />
          ))}
        </div>
      )}

      <TestimonialsSection
        id="success-stories"
        h2={[{ text: content.reviews.h2 }]}
        reviews={content.reviews.items}
        rating={testimonials.rating}
      />
      <ServiceFaq faqs={content.faqs} />
      <ServiceSidebar sidebar={content.sidebar} />
      <ServiceCta closing={content.closing} />
      <InstagramStrip />
    </>
  )
}
