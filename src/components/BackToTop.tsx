import { useEffect, useState } from 'react'

// Rejuvita's fixed scroll-to-top button (footer widget 735188bf in elementor/css/post-161.css):
// accent square, bottom 80px (106px from md up, above FloatingWhatsApp) / right 30px, rises 20px into place once the page has scrolled a screen.
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className={`fixed right-[30px] bottom-20 z-[9998] md:bottom-[106px] rounded-[5px] bg-accent p-[17px] text-secondary transition-all duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background ${
        visible ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-5 opacity-0'
      }`}
    >
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 10.5 5-5 5 5" />
      </svg>
    </button>
  )
}
