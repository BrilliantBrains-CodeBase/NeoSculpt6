import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; children: ReactNode }

// Internal paths go through the router; home anchors (/#…), tel:, mailto: and external URLs stay plain links
// (external ones open in a new tab).
export function SmartLink({ href, children, ...rest }: Props) {
  if (href.startsWith('/') && !href.includes('#')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  }
  const external = /^https?:/.test(href)
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
