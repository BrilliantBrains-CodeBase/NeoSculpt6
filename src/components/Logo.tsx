import { Link } from 'react-router-dom'
import { clinic } from '../data/site'

// Official horizontal logo, version for dark backgrounds (gold mark and name, white tagline). Source file:
// content/brand/logo/neosculpt6-horizontal-for-dark-bg.png, exported at 3x to public/images/logo-horizontal.webp.
// Width follows the theme's logo: 260px desktop and tablet, 190px mobile.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label={`${clinic.name} home`} className={`inline-flex ${className}`}>
      <img
        src="/images/logo-horizontal.webp"
        alt={`${clinic.name}, The Art of Transformation`}
        width={780}
        height={159}
        className="h-auto w-[190px] md:w-[260px]"
      />
    </Link>
  )
}
