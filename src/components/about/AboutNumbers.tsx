import { numbers } from '../../data/about'
import { StatCounter } from '../home/HomeStats'

// About extra A: clinic in numbers. The home stats band (HomeStats: Rejuvita counter row 8dcdccf, same background,
// overlay and counters) set as two rows of four, as about-us.md asks. The counters hold their final values in the
// prerendered HTML and only count up without reduced motion.
// Breakpoints are the theme's: base = mobile (<=767, two columns), md = tablet (two), xl = desktop (four).

export function AboutNumbers() {
  return (
    <section
      id="clinic-in-numbers"
      aria-label={numbers.label}
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate bg-cover bg-center bg-no-repeat px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[130px]"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      <div className="mx-auto w-full max-w-[1400px]">
        <dl className="grid grid-cols-2 gap-x-5 gap-y-[35px] md:gap-x-[35px] xl:grid-cols-4 xl:gap-y-[50px]">
          {numbers.items.map((item, i) => (
            <StatCounter key={item.label} {...item} index={i % 4} className="w-full" />
          ))}
        </dl>
        <p className="mt-[50px] text-center max-md:text-left text-small text-text/70">{numbers.note}</p>
      </div>
    </section>
  )
}
