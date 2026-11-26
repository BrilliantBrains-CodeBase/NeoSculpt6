import type { CSSProperties } from 'react'
import { confirmedLogos, memberships } from '../../data/about'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { HomeCredentials } from '../home/HomeCredentials'
import { ArrowRightIcon } from '../icons'
import { Parts } from '../shared'

// About extra E: memberships, teaching and Neo Group (about-us.md §E). The home credentials strip (HomeCredentials,
// Rejuvita 862578e) with only the memberships confirmed in data/about.ts (ISHRS, AHRS and DHI Global are added once
// signed off), then the Neo Group cards. Links to the sister clinics open in a new tab (SmartLink).
// The Neo Follicle crossing date shows only once signed off.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutMemberships() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const cardsRef = useReveal<HTMLUListElement>()

  return (
    <section
      id="memberships"
      aria-label="Memberships, recognition and Neo Group"
      className="px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-20 md:gap-[100px]">
        <HomeCredentials label={memberships.label} logos={confirmedLogos} />

        <div className="flex flex-col gap-10">
          <h3 ref={titleRef} data-reveal="up" className="text-center max-md:text-left font-heading text-h3 text-secondary uppercase">
            <Parts parts={memberships.h3} />
          </h3>
          <ul ref={cardsRef} data-reveal-stagger="" className="mx-auto grid w-full max-w-[1000px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px]">
            {memberships.group.map((card, i) => (
              <li
                key={card.name}
                style={{ '--i': i } as CSSProperties}
                className="group relative flex flex-col gap-[15px] rounded-[20px] bg-alternate p-[30px] transition duration-300 motion-safe:hover:-translate-y-1 md:p-10"
              >
                <h4 className="font-heading text-h5 text-secondary uppercase">
                  <SmartLink
                    href={card.href}
                    className="outline-hidden transition-colors duration-300 group-hover:text-primary after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:text-primary focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-primary"
                  >
                    {card.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </SmartLink>
                </h4>
                <p>
                  {card.text}
                  {card.claim?.signedOff ? `; ${card.claim.text}.` : '.'}
                </p>
                <span aria-hidden="true" className="mt-auto flex items-center gap-2.5 text-button font-semibold text-tertiary uppercase">
                  Visit website <ArrowRightIcon className="size-3.5 shrink-0" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
