import { Fragment, useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react'
import { signature } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { Marquee } from '../Marquee'

// Home section 8: the Rejuvita hotspot section (rejuvita-scrape/pages/home, container cfe3ab5 > row 3d4b247: hotspot
// image 688f56b and text column af2b9b5, then marquee e93b869; styles from elementor/css/post-39758.css and
// cmsmasters-elementor-addon/assets/css/widget-cmsmasters-hotspot.min.css).
// Changes from the theme:
// - The image is rounded like the other home images and sits inside the page gutter instead of touching the edge.
// - Tooltips show a title and a line, so they wrap at a fixed width. They open on click/tap or keyboard focus as
//   well as hover, and stay inside the image.
// - The ticker pauses on hover and focus.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop, plus min-[1601px] for
// the theme's widescreen rules. Below xl the text sits above the image (theme: column-reverse).

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeSignature() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const buttonRef = useReveal<HTMLDivElement>()
  const imageRef = useReveal<HTMLDivElement>()
  const tickerRef = useReveal<HTMLDivElement>()

  return (
    <section
      aria-labelledby="signature-heading"
      className="mb-20 flex flex-col bg-alternate md:mb-[100px] xl:mb-[150px] xl:min-h-screen min-[1601px]:min-h-[750px]"
    >
      {/* Row (3d4b247): image left, text right on desktop; text above the image below that. */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col-reverse items-center px-5 md:px-[30px] xl:flex-1 xl:flex-row xl:justify-center xl:px-10 xl:pt-[50px]">
        {/* Hotspot image (688f56b): 660px wide on desktop, full width up to 660px below that. */}
        <div ref={imageRef} data-reveal="up" className="w-full max-w-[660px] xl:w-1/2">
          <HotspotImage />
        </div>

        {/* Text column (af2b9b5) */}
        <div className="flex w-full flex-col items-center gap-[30px] py-20 text-center md:py-[100px] xl:w-1/2 xl:gap-10 xl:p-[50px] min-[1601px]:p-[100px]">
          <p ref={eyebrowRef} data-reveal="up" className="text-h6 font-medium text-text uppercase">
            {signature.eyebrow}
          </p>
          <h2
            id="signature-heading"
            ref={titleRef}
            data-reveal="up"
            style={delay(150)}
            className="max-w-[600px] font-heading text-h2 text-secondary uppercase"
          >
            {signature.h2.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className="block">
                  {line.map((part) => (
                    <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                      {part.text}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </h2>
          <p
            ref={textRef}
            data-reveal="up"
            style={delay(300)}
            className="max-w-[600px] font-accent-serif text-[18px] leading-[1.35] italic md:text-[20px] xl:mb-5 xl:text-[22px]"
          >
            {signature.text}
          </p>
          <div ref={buttonRef} data-reveal="pop" style={delay(450)}>
            <SmartLink
              href={signature.cta.href}
              className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
            >
              {signature.cta.label}
            </SmartLink>
          </div>
        </div>
      </div>

      {/* Technology ticker (e93b869) */}
      <div ref={tickerRef} data-reveal="">
        <Marquee
          items={signature.ticker}
          separator="✦"
          pausable
          label="Technologies at NeoSculpt6"
          className="py-10 [--marquee-gap:80px] [--marquee-item-gap:60px] md:[--marquee-item-gap:80px]"
          itemClassName="font-heading text-h5 text-secondary uppercase"
          separatorClassName="text-[35px] leading-none text-tertiary"
        />
      </div>
    </section>
  )
}

// Tooltip geometry, in px from the dot's centre. The theme's tooltip gap is 13px past a 21px dot with a 5px ring.
const TIP_OFFSET = 30
const ARROW = 10
// Tooltip width: 260px, or the image width less 10px each side. `left` is clamped so the tooltip never leaves the
// image, whatever the dot's position or the screen width.
const TIP_WIDTH = 'min(260px, 100% - 20px)'
const tipLeft = (x: number) => `clamp(10px, ${x}% - min(130px, 50% - 10px), 100% - ${TIP_WIDTH} - 10px)`

function HotspotImage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useReveal<HTMLDivElement>()
  // `pinned` opens on click, tap or keyboard focus and stays open; `hovered` follows the mouse. Hover wins.
  const [pinned, setPinned] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const open = hovered ?? pinned

  // Tapping or clicking anywhere outside the image closes a pinned tooltip.
  useEffect(() => {
    if (pinned === null) return
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setPinned(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [pinned])

  // Keyboard focus opens the tooltip. A mouse click also focuses the button, so only :focus-visible counts here;
  // the click itself does the toggling.
  const onFocus = (i: number) => (e: FocusEvent<HTMLButtonElement>) => {
    let keyboard = true
    try {
      keyboard = e.currentTarget.matches(':focus-visible')
    } catch {
      // Very old browsers without :focus-visible: treat focus as keyboard focus.
    }
    if (keyboard) setPinned(i)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setPinned(null)
          setHovered(null)
        }
      }}
    >
      <img
        src={signature.image.src}
        width={signature.image.width}
        height={signature.image.height}
        alt={signature.image.alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-[20px]"
      />

      {/* The dots fade in one after another, 200ms apart (the theme's sequenced animation-delay). */}
      <div ref={dotsRef} data-reveal-stagger="" className="absolute inset-0">
        {signature.hotspots.map((spot, i) => {
          const isOpen = open === i
          const tipId = `signature-hotspot-${i}`
          const above = spot.side === 'top'
          return (
            <div
              key={spot.title}
              style={{ '--i': i } as CSSProperties}
              className={`pointer-events-none absolute inset-0 ${isOpen ? 'z-10' : ''}`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={tipId}
                onClick={() => setPinned((p) => (p === i ? null : i))}
                onFocus={onFocus(i)}
                onBlur={() => setPinned((p) => (p === i ? null : p))}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(i)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered((h) => (h === i ? null : h))}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="pointer-events-auto absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-tertiary"
              >
                <span className="sr-only">{spot.title}</span>
                <span
                  aria-hidden="true"
                  className={`hotspot-beat block size-[15px] rounded-full shadow-[0_0_0_5px_rgba(255,255,255,0.3)] transition-colors duration-300 md:size-[21px] ${isOpen ? 'bg-tertiary' : 'bg-secondary'}`}
                />
              </button>

              {/* Arrow, pointing at the dot */}
              <span
                aria-hidden="true"
                style={{
                  left: `${spot.x}%`,
                  ...(above
                    ? { bottom: `calc(${100 - spot.y}% + ${TIP_OFFSET - ARROW}px)` }
                    : { top: `calc(${spot.y}% + ${TIP_OFFSET - ARROW}px)` }),
                }}
                className={`absolute size-0 -translate-x-1/2 border-x-[10px] border-x-transparent transition-opacity duration-300 motion-reduce:transition-none ${
                  above ? 'border-t-[10px] border-t-secondary' : 'border-b-[10px] border-b-secondary'
                } ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
              />

              {/* Tooltip. It ignores the pointer (it has no links), so it never blocks a dot underneath it. */}
              <div
                id={tipId}
                style={{
                  left: tipLeft(spot.x),
                  width: TIP_WIDTH,
                  ...(above
                    ? { bottom: `calc(${100 - spot.y}% + ${TIP_OFFSET}px)` }
                    : { top: `calc(${spot.y}% + ${TIP_OFFSET}px)` }),
                }}
                className={`absolute rounded-[7px] bg-secondary px-[15px] py-3 text-left text-meta text-background shadow-[0_10px_30px_0_rgba(0,0,0,0.3)] transition-[opacity,visibility,translate] duration-300 motion-reduce:transition-none ${
                  isOpen ? 'visible translate-y-0 opacity-100' : `invisible opacity-0 ${above ? '-translate-y-2' : 'translate-y-2'}`
                }`}
              >
                <strong className="mb-1 block font-semibold">{spot.title}</strong>
                <span className="block">{spot.text}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
