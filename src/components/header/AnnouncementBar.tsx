import { useEffect, useState } from 'react'
import { clinic } from '../../data/site'

// Announcement bar (theme container 1cb50bcb): bg `text`, meta text in `alternate`.
// - xl and up: one line, address and hours left, email right.
// - Below xl the line doesn't fit, so one item shows at a time and auto-slides. Items share a grid cell, which holds the
//   bar at its tallest item's height. Centred on phones and tablets.
// - The slider holds on mouse hover, keyboard focus and a tap (a second tap restarts it). Focusing the email brings it
//   into view. With reduced motion there is no sliding: the items stack.
// - Every item stays in the DOM, so screen readers get all three and search engines see the full text.

const INTERVAL = 4000 // ms each item stays on screen
const COUNT = 3
const EMAIL_INDEX = 2

const slide =
  'justify-self-center self-center [grid-area:1/1] transition-[translate,opacity] duration-500 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:pointer-events-auto motion-reduce:transition-none motion-reduce:[grid-area:auto] xl:translate-x-0 xl:opacity-100 xl:pointer-events-auto xl:transition-none xl:[grid-area:auto]'
// By distance from the item on screen: 0 is showing, 1 waits on the right, 2 has just left.
const positions = ['translate-x-0 opacity-100', 'pointer-events-none translate-x-full opacity-0', 'pointer-events-none -translate-x-full opacity-0']

export function AnnouncementBar() {
  const { address } = clinic
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [sliding, setSliding] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1180px) and (prefers-reduced-motion: no-preference)')
    const update = () => setSliding(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!sliding || paused) return
    const timer = setTimeout(() => setActive((i) => (i + 1) % COUNT), INTERVAL)
    return () => clearTimeout(timer)
  }, [active, paused, sliding])

  const position = (i: number) => `${slide} ${positions[(i - active + COUNT) % COUNT]}`

  return (
    <div
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      onPointerUp={(e) => e.pointerType === 'touch' && setPaused((p) => !p)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="grid overflow-hidden bg-text px-5 py-[9px] text-center text-meta font-medium text-alternate md:px-[30px] xl:flex xl:items-center xl:px-10 xl:text-left"
    >
      <p className={position(0)}>
        {address.streetAddress}, {address.addressLocality} {address.postalCode}
      </p>
      <span aria-hidden="true" className="hidden xl:inline xl:px-1.5">
        ·
      </span>
      <p className={position(1)}>{clinic.hours.label}</p>
      <a
        href={`mailto:${clinic.email}`}
        onFocus={() => setActive(EMAIL_INDEX)}
        className={`${position(EMAIL_INDEX)} whitespace-nowrap hover:text-accent focus-visible:text-accent xl:ml-auto xl:pl-5`}
      >
        {clinic.email}
      </a>
    </div>
  )
}
