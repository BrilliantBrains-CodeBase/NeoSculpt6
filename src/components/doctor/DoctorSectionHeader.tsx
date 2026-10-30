import { useReveal } from '../useReveal'
import { delay, eyebrow, h2 } from '../shared'

// A doctor-profile section's eyebrow and H2, centred as the theme's section titles (left-aligned on phones). The H2
// carries the id the section's aria-labelledby points at.

export function DoctorSectionHeader({ id, label, title, align = 'center' }: { id: string; label: string | null; title: string; align?: 'center' | 'start' }) {
  const ref = useReveal<HTMLDivElement>()
  const centred = align === 'center'
  return (
    <div
      ref={ref}
      data-reveal="up"
      className={`flex flex-col gap-5 ${centred ? 'items-center text-center max-md:items-start max-md:text-left' : 'items-start'}`}
    >
      {label && <p className={eyebrow}>{label}</p>}
      <h2 id={id} style={delay(150)} className={`${h2} max-w-[1080px] text-balance`}>
        {title}
      </h2>
    </div>
  )
}
