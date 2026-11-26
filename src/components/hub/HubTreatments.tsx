import type { CSSProperties } from 'react'
import type { SpecialityHub } from '../../data/specialities/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { delay, h2, italicLine } from '../shared'

// Speciality hub: every child page, grouped (src/data/specialities/). Centred H2 and sub-line as the service sections,
// then one row per group: at the left the group's rounded photo, H3 and line (kept in view while its cards scroll on
// desktop), at the right its treatment cards, the black template's `alternate` 20px cards with the title, the opening
// of that page's banner and "Explore", whose accessible name adds the title. All links are plain links in the HTML (no
// tabs or carousel), so every child page is reachable by keyboard and by crawlers. Two cards per row from tablet up,
// one on mobile; below xl the group's photo sits above its cards as a wide crop. A group without an approved photo
// shows its heading and line only.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function HubTreatments({ treatments }: { treatments: SpecialityHub['treatments'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()

  return (
    <section
      id="hub-treatments"
      aria-labelledby="hub-treatments-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="hub-treatments-heading" ref={titleRef} data-reveal="up" className={`${h2} max-w-[1080px] text-center max-md:text-left text-balance`}>
        {treatments.h2}
      </h2>
      <p ref={sublineRef} data-reveal="up" style={delay(150)} className={`${italicLine} max-w-[860px] text-center max-md:text-left text-secondary`}>
        {treatments.subline}
      </p>

      <div className="mt-10 flex w-full flex-col gap-[60px] md:mt-[60px] md:gap-20 xl:gap-[100px]">
        {treatments.groups.map((group, g) => (
          <Group key={group.title} group={group} index={g} />
        ))}
      </div>
    </section>
  )
}

function Group({ group, index }: { group: SpecialityHub['treatments']['groups'][number]; index: number }) {
  const headRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLUListElement>()
  const headingId = `hub-treatments-group-${index}`

  return (
    <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:gap-[60px]">
      <div ref={headRef} data-reveal="up" className="flex flex-col gap-5 xl:sticky xl:top-[calc(var(--header-offset)+30px)] xl:self-start">
        {group.image && (
          <img
            src={group.image.src}
            width={group.image.width}
            height={group.image.height}
            alt={group.image.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full rounded-[20px] object-cover xl:aspect-[4/5]"
          />
        )}
        <h3 id={headingId} className="font-heading text-h4 text-balance text-secondary uppercase">
          {group.title}
        </h3>
        <p>{group.text}</p>
      </div>

      <ul ref={listRef} data-reveal-stagger="" aria-labelledby={headingId} className="grid grid-cols-1 gap-5 self-start md:grid-cols-2 md:gap-[30px]">
        {group.items.map((item, i) => (
          <li key={item.href} style={{ '--i': i } as CSSProperties}>
            <article className="flex h-full flex-col items-start gap-[15px] rounded-[20px] bg-alternate p-[30px] md:p-10">
              <h4 className="font-heading text-h5 text-secondary uppercase">{item.title}</h4>
              <p className="text-small">{item.text}</p>
              <SmartLink
                href={item.href}
                className="mt-auto inline-flex items-center gap-2.5 border-t border-border pt-5 text-button font-semibold text-secondary uppercase transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2"
              >
                Explore
                <span className="sr-only">: {item.title}</span>
                <ArrowRightIcon className="size-3 shrink-0" />
              </SmartLink>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
