import type { CSSProperties } from 'react'
import { story } from '../../data/about'
import { useReveal } from '../useReveal'
import { Parts, delay, eyebrow, h2 } from '../shared'

// About section 2: Rejuvita "Our Story" row (rejuvita-scrape/pages/about-us, the second row of the about block:
// heading, text and two small photos on the left, a tall photo on the right; screenshot-desktop.png). The theme's first
// row ("Welcome to Rejuvita Clinic") has no counterpart in about-us.md, so it is left out. Copy: about-us.md §2.
// Below xl everything stacks: text, the two small photos side by side, then the tall photo.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutStory() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const smallRef = useReveal<HTMLDivElement>()
  const tallRef = useReveal<HTMLDivElement>()
  const { procedure, consultation, tall } = story.images

  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px] xl:flex-row xl:items-stretch xl:gap-5">
        <div className="flex flex-col gap-[30px] xl:w-1/2 xl:justify-between xl:gap-10">
          <div className="flex flex-col gap-[30px] xl:max-w-[560px] xl:pt-10">
            <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
              {story.eyebrow}
            </p>
            <h2 id="our-story-heading" ref={titleRef} data-reveal="up" style={delay(150)} className={h2}>
              <Parts parts={story.h2} />
            </h2>
            <p ref={textRef} data-reveal="up" style={delay(300)}>
              {story.text}
            </p>
          </div>

          {/* Two small photos */}
          <div ref={smallRef} data-reveal-stagger="" className="grid grid-cols-2 gap-5">
            {[procedure, consultation].map((image, i) => (
              <img
                key={image.src}
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                style={{ '--i': i } as CSSProperties}
                className="aspect-square w-full rounded-[20px] object-cover"
              />
            ))}
          </div>
        </div>

        {/* Tall photo */}
        <div ref={tallRef} data-reveal="pop" style={delay(300)} className="xl:w-1/2">
          <img
            src={tall.src}
            width={tall.width}
            height={tall.height}
            alt={tall.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full rounded-[20px] object-cover md:aspect-[16/11] xl:aspect-auto xl:h-full xl:min-h-[680px]"
          />
        </div>
      </div>
    </section>
  )
}
