import { privacy } from '../../data/contact'
import { useReveal } from '../useReveal'

// Contact section 7: a quiet bordered privacy note. A reassurance, not a privacy policy; it links to no policy page
// until /privacy-policy/ exists with approved content.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ContactPrivacy() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="contact-privacy" aria-labelledby="contact-privacy-heading" className="px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[120px]">
      <div ref={ref} data-reveal="up" className="mx-auto max-w-[940px] rounded-[20px] border border-border px-5 py-[30px] md:px-10 md:py-10">
        <h2 id="contact-privacy-heading" className="mb-3 text-h6 font-medium text-tertiary uppercase">
          {privacy.heading}
        </h2>
        <p className="text-small text-text">{privacy.text}</p>
      </div>
    </section>
  )
}
