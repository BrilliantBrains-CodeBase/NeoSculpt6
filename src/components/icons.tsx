// Inline icons; the theme's icon font isn't part of the capture. Size them with a className.
const iconProps = { 'aria-hidden': true, focusable: false } as const
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

type IconProps = { className?: string }

export function PhoneIcon({ className = 'size-[18px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  )
}

export function MailIcon({ className = 'size-[18px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'size-[18px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2z" />
      <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.1-.2.3 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.5.4-2.7-.1a10 10 0 0 1-4.7-4.7C8.6 10 8.7 9.2 9 8.6z" />
    </svg>
  )
}

export function MapPinIcon({ className = 'size-[18px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

export function CalendarIcon({ className = 'size-[18px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  )
}

// The theme's small "dropdown-down" glyph.
export function ChevronDownIcon({ className = 'size-[5px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 10 10" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m1.5 3.5 3.5 3.5 3.5-3.5" />
    </svg>
  )
}

export function BurgerIcon({ className = 'size-8' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 9h24M4 16h24M10 23h18" />
    </svg>
  )
}

export function CloseIcon({ className = 'size-[18px]' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 18 18" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="m2 2 14 14M16 2 2 16" />
    </svg>
  )
}

export function FacebookIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
    </svg>
  )
}

export function InstagramIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YoutubeIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1.1 8.9 1.1 12 1.1 12s0 3.1.4 4.8a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM9.8 15.1V8.9l5.6 3.1-5.6 3.1z" />
    </svg>
  )
}

export function LinkedInIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.9 21H2.6V8.9h4.3V21zM4.7 7.2a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM21.4 21h-4.3v-5.9c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1v6H8.6V8.9h4.1v1.7h.1c.6-1.1 2-2.2 4-2.2 4.3 0 5.1 2.8 5.1 6.5V21z" />
    </svg>
  )
}

// Theme glyphs from the captured Local-Icons font (rejuvita-scrape/assets/…/cmsmasters-local-icons/Local-Icons/fonts/
// Local-Icons.svg). Font glyphs are y-up on a 1024 em with a 960 ascent, so the group flips them into the viewBox.
const glyph = (d: string, className: string) => (
  <svg {...iconProps} viewBox="0 0 1024 1024" className={className} fill="currentColor">
    <path transform="matrix(1 0 0 -1 0 960)" d={d} />
  </svg>
)

// The theme's flower mark ("rejuvita"), used on the tab buttons.
export function FlowerIcon({ className = 'size-[30px] shrink-0' }: IconProps) {
  return glyph('M512.007 434.418c-3.386 0-6.772 1.249-9.445 3.922l-146.142 146.142c-41.528 41.528-64.34 96.777-64.34 155.59s22.812 114.063 64.34 155.589c41.523 41.526 96.775 64.339 155.587 64.339 58.815 0 114.063-22.813 155.59-64.339 85.726-85.725 85.726-225.274 0-310.998l-146.142-146.145c-2.495-2.85-6.062-4.099-9.448-4.099zM512.007 933.088c-51.685 0-100.161-20.139-136.697-56.675-36.535-36.536-56.674-85.012-56.674-136.697s20.139-100.162 56.674-136.696l136.697-136.697 136.697 136.697c75.39 75.388 75.39 197.827 0 273.215-36.536 36.714-85.012 56.853-136.697 56.853zM804.116 227.86c-58.812 0-114.063 22.815-155.587 64.341l-146.145 146.142c-2.495 2.495-3.919 5.881-3.919 9.445 0 3.567 1.423 6.953 3.919 9.448l146.145 146.142c41.523 41.526 96.775 64.338 155.587 64.338 58.815 0 114.063-22.813 155.59-64.338 85.726-85.726 85.726-225.273 0-310.999-41.527-41.704-96.775-64.519-155.59-64.519zM530.9 447.788l136.697-136.697c36.536-36.536 85.012-56.675 136.697-56.675s100.164 20.139 136.697 56.675c75.39 75.39 75.39 197.83 0 273.217-36.533 36.536-85.012 56.675-136.697 56.675s-100.161-20.139-136.697-56.675l-136.697-136.52zM219.929 227.86c-58.814 0-114.063 22.815-155.589 64.341-41.526 41.523-64.339 96.775-64.339 155.587 0 58.815 22.813 114.063 64.339 155.59 41.526 41.526 96.775 64.338 155.589 64.338s114.063-22.813 155.589-64.338l146.142-146.142c5.168-5.171 5.168-13.725 0-18.893l-146.142-146.142c-41.527-41.527-96.776-64.341-155.589-64.341zM219.929 640.983c-51.685 0-100.162-20.139-136.697-56.675-36.358-36.359-56.497-84.835-56.497-136.52s20.139-100.161 56.675-136.697c36.536-36.536 85.012-56.675 136.697-56.675s100.162 20.139 136.696 56.675l136.697 136.697-136.697 136.697c-36.713 36.358-85.189 56.497-136.874 56.497zM512.038-64.242c-58.812 0-114.063 22.811-155.59 64.338-85.724 85.726-85.724 225.273 0 310.999l146.145 146.142c2.495 2.495 5.881 3.922 9.445 3.922s6.95-1.427 9.445-3.922l146.145-146.142c85.726-85.726 85.726-225.273 0-310.999-41.527-41.527-96.775-64.338-155.59-64.338zM512.038 428.899l-136.697-136.697c-75.388-75.387-75.388-197.827 0-273.217 36.536-36.533 85.012-56.675 136.697-56.675s100.161 20.142 136.697 56.675c75.39 75.39 75.39 197.83 0 273.217l-136.697 136.697zM512.007 434.429c-3.031 0-6.059 1.068-8.554 3.209-3.031 2.495-74.499 63.802-74.499 141.865 0 78.061 71.468 139.37 74.499 141.865 4.99 4.277 12.298 4.277 17.289 0 3.028-2.495 74.496-63.804 74.496-141.865 0-78.063-71.468-139.37-74.496-141.865-2.495-2.14-5.704-3.209-8.735-3.209zM512.007 692.673c-17.644-17.822-56.497-62.557-56.497-113.349 0-50.794 38.676-95.529 56.497-113.35 17.644 17.821 56.497 62.556 56.497 113.35 0 51.148-38.673 95.704-56.497 113.349zM512 171.196c-3.031 0-6.062 1.068-8.557 3.205-3.028 2.495-74.496 63.805-74.496 141.868 0 78.060 71.468 139.37 74.496 141.865 4.99 4.277 12.298 4.277 17.289 0 3.031-2.495 74.499-63.805 74.499-141.865 0-78.063-71.468-139.373-74.499-141.868-2.495-2.314-5.704-3.205-8.731-3.205zM512 429.438c-17.644-17.821-56.497-62.556-56.497-113.35s38.673-95.526 56.497-113.35c17.644 17.824 56.494 62.556 56.494 113.35 0 50.975-38.673 95.706-56.494 113.35zM643.751 364.568c-78.063 0-139.37 71.468-141.865 74.496-4.277 4.99-4.277 12.298 0 17.289 2.495 3.031 63.802 74.496 141.865 74.496s139.37-71.465 141.865-74.496c4.277-4.99 4.277-12.298 0-17.289-2.495-2.85-63.802-74.496-141.865-74.496zM530.401 447.799c17.821-17.644 62.556-56.497 113.35-56.497 50.971 0 95.526 38.673 113.35 56.497-17.824 17.644-62.556 56.497-113.35 56.497-50.971 0-95.529-38.854-113.35-56.497zM380.505 364.568c-78.062 0-139.37 71.468-141.866 74.496-4.277 4.99-4.277 12.298 0 17.289 2.495 3.031 63.804 74.496 141.866 74.496s139.37-71.465 141.865-74.496c4.277-4.99 4.277-12.298 0-17.289-2.673-2.85-63.983-74.496-141.865-74.496zM267.155 447.799c17.822-17.644 62.556-56.497 113.35-56.497 50.971 0 95.529 38.673 113.35 56.497-17.821 17.644-62.556 56.497-113.35 56.497-50.972 0-95.706-38.854-113.35-56.497z', className)
}

export function TickIcon({ className = 'size-5 shrink-0' }: IconProps) {
  return glyph('M950.303 664.051l-540.703-540.705-335.906 335.905 108.612 108.612 227.294-227.295 432.093 432.095 108.611-108.612z', className)
}

export function ArrowLeftIcon({ className = 'size-4 shrink-0' }: IconProps) {
  return glyph('M746.646 960l23.357-23.357-483.805-483.805 483.805-483.805-23.357-23.357-507.162 507.162 507.162 507.162z', className)
}

export function ArrowRightIcon({ className = 'size-4 shrink-0' }: IconProps) {
  return glyph('M723.289 452.838l-483.805 483.805 23.357 23.357 507.162-507.162-507.162-507.162-23.357 23.357 483.805 483.805z', className)
}

// The before/after handle's double chevron (cmsmasters-before-after, home b74fcc6).
export function CompareArrowsIcon({ className = 'size-[25px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 20 12" className={className} fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.766 0.222482L19.5895 5.04594C19.8855 5.34193 19.8855 5.82183 19.5895 6.11782L14.766 10.9413C14.4701 11.2373 13.9902 11.2373 13.6942 10.9413C13.3982 10.6453 13.3982 10.1654 13.6942 9.8694L17.9817 5.58188L13.6942 1.29436C13.3982 0.998371 13.3982 0.518474 13.6942 0.222482C13.9902 -0.0735096 14.4701 -0.0735096 14.766 0.222482Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.04548 0.221994L0.222019 5.04545C-0.0739727 5.34145 -0.0739727 5.82134 0.222019 6.11733L5.04548 10.9408C5.34147 11.2368 5.82137 11.2368 6.11736 10.9408C6.41335 10.6448 6.41335 10.1649 6.11736 9.86892L1.82984 5.58139L6.11736 1.29387C6.41335 0.997882 6.41335 0.517985 6.11736 0.221994C5.82137 -0.0739979 5.34147 -0.0739979 5.04548 0.221994Z" />
    </svg>
  )
}

// Rating star (the theme's demo star font isn't in the capture; a plain five-point star at the same size).
export function StarIcon({ className = 'size-[22px] shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 1.6l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.7l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z" />
    </svg>
  )
}

export function PauseIcon({ className = 'size-3 shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 12 12" className={className} fill="currentColor">
      <rect x="2" y="1" width="3" height="10" rx="0.5" />
      <rect x="7" y="1" width="3" height="10" rx="0.5" />
    </svg>
  )
}

export function PlayIcon({ className = 'size-3 shrink-0' }: IconProps) {
  return (
    <svg {...iconProps} viewBox="0 0 12 12" className={className} fill="currentColor">
      <path d="M2.5 1.2v9.6a.5.5 0 0 0 .76.43l7.6-4.8a.5.5 0 0 0 0-.86l-7.6-4.8a.5.5 0 0 0-.76.43z" />
    </svg>
  )
}
