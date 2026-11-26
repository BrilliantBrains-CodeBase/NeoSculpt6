import type { CSSProperties } from 'react'

// Bits shared by the About and service page sections (src/components/about/*, src/components/service/*). Same values
// as the home sections use inline.

export const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

// The theme's filled button (accent, rose on hover/focus). It may wrap on phones: some About labels are longer than
// the home page's and would overflow a 390px screen on one line.
export const button =
  'inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-center text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background md:whitespace-nowrap'

// The home hero's second button (light fill), for a page's secondary action next to `button`.
export const lightButton =
  'inline-block rounded-[7px] bg-text px-[35px] py-[14px] text-center text-button font-semibold text-background uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background md:whitespace-nowrap'

// The pillars' outlined button (HomePillars), for a quieter secondary action next to `button`.
export const outlineButton =
  'inline-block rounded-[7px] border border-secondary px-[35px] py-[14px] text-center text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-alternate focus-visible:border-primary focus-visible:bg-primary focus-visible:text-alternate md:whitespace-nowrap'

export const eyebrow = 'text-h6 font-medium text-text uppercase'
export const h2 = 'font-heading text-h2 text-secondary uppercase'
export const italicLine = 'font-accent-serif text-[18px] leading-[1.35] italic md:text-[20px] xl:text-[22px]'

// A heading's parts, with `gold` parts in the theme's tertiary highlight.
export function Parts({ parts }: { parts: { text: string; gold?: boolean }[] }) {
  return (
    <>
      {parts.map((part) => (
        <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
          {part.text}
        </span>
      ))}
    </>
  )
}
