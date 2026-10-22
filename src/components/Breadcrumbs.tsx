import { Fragment, type CSSProperties, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { pageByPath } from '../data/entries'

// Page-banner breadcrumb (About banner, service hero). Names come from routes.json, the same names the page's
// BreadcrumbList schema uses (Seo.tsx), so the two never differ. The current page is the last item, not a link.

export function Breadcrumbs({
  crumbs,
  navRef,
  reveal,
  style,
  className = '',
}: {
  /** Paths from page.crumbs, Home first. */
  crumbs: string[]
  navRef?: Ref<HTMLElement>
  reveal?: string
  style?: CSSProperties
  className?: string
}) {
  const items = crumbs.map((path) => ({ path, name: path === '/' ? 'Home' : (pageByPath.get(path)?.name ?? path) }))

  return (
    <nav ref={navRef} data-reveal={reveal} style={style} aria-label="Breadcrumb" className={className || undefined}>
      <ol className="flex flex-wrap items-center gap-x-2.5 text-meta text-text">
        {items.map((crumb, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={crumb.path}>
              {i > 0 && (
                <li aria-hidden="true" className="text-tertiary">
                  ›
                </li>
              )}
              <li>
                {last ? (
                  <span aria-current="page" className="text-secondary">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="underline-offset-4 transition-colors duration-300 hover:text-tertiary hover:underline focus-visible:text-tertiary focus-visible:underline"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
