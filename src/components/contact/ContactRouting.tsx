import { routing } from '../../data/contact'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { Parts, button, delay, italicLine } from '../shared'

// Contact section 6: speciality and doctor routing. A compact band: heading, subline and "Find My Treatment" (the
// home finder) on the left, links to the doctors, specialities, technology and international pages on the right.
// Visitors never have to pick a procedure first: the form's "Not sure" options and the finder cover that.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const linkClass =
  'flex items-center justify-between gap-5 border-b border-border py-[18px] font-heading text-h6 text-secondary uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary'

export function ContactRouting() {
  const textRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLElement>()

  return (
    <section
      id="contact-routing"
      aria-labelledby="contact-routing-heading"
      className="mx-auto grid max-w-site grid-cols-1 gap-[50px] px-5 pb-20 md:px-[30px] md:pb-[100px] xl:grid-cols-2 xl:gap-20 xl:px-10 xl:pb-[120px]"
    >
      <div ref={textRef} data-reveal="up" className="flex flex-col items-start gap-[25px]">
        <h2 id="contact-routing-heading" className="font-heading text-h3 text-secondary uppercase text-balance">
          <Parts parts={routing.h2} />
        </h2>
        <p className={`${italicLine} max-w-[520px] text-text`}>{routing.subline}</p>
        <SmartLink href={routing.cta.href} className={button}>
          {routing.cta.label}
        </SmartLink>
      </div>
      <nav ref={listRef} data-reveal="up" style={delay(150)} aria-labelledby="contact-routing-heading">
        <ul className="border-t border-border">
          {routing.links.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href} className={linkClass}>
                {link.label}
                <ArrowRightIcon className="size-4 shrink-0 text-primary" />
              </SmartLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
