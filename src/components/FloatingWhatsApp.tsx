import { clinic } from '../data/site'
import { WhatsAppLogo } from './icons'

// Floating WhatsApp button for tablets and desktops (768px+), from homepage.md's floating side buttons.
// Phones get WhatsApp in the sticky MobileActionBar instead. Sits below BackToTop, sharing its centre line.
export function FloatingWhatsApp() {
  return (
    <a
      href={clinic.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp (opens in a new tab)"
      className="fixed right-[27px] bottom-[30px] z-[9998] hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] outline-offset-4 outline-[#25D366] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe5b] focus-visible:-translate-y-0.5 focus-visible:bg-[#1ebe5b] focus-visible:outline-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:flex"
    >
      <WhatsAppLogo className="size-[30px]" />
    </a>
  )
}
