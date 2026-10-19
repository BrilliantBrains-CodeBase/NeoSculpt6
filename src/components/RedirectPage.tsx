import { useEffect } from 'react'
import { Head } from 'vite-react-ssg'
import { useNavigate } from 'react-router-dom'
import type { RouteRedirect } from '../data/types'
import { SITE_URL } from '../data/site'

// Fallback for hosts that ignore public/_redirects: the static HTML meta-refreshes,
// and client-side navigation replaces the route.
export function RedirectPage({ entry }: { entry: RouteRedirect }) {
  const navigate = useNavigate()
  useEffect(() => navigate(entry.redirectTo, { replace: true }), [navigate, entry.redirectTo])
  return (
    <>
      <Head>
        <title>{entry.title}</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={SITE_URL + entry.redirectTo} />
        <meta httpEquiv="refresh" content={`0; url=${entry.redirectTo}`} />
      </Head>
      <p>
        This page has moved to <a href={entry.redirectTo}>{entry.redirectTo}</a>.
      </p>
    </>
  )
}
