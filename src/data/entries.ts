import routesJson from './routes.json'
import type { RouteEntry, RoutePage } from './types'

export const entries = routesJson as unknown as RouteEntry[]
export const pageByPath = new Map(entries.filter((e): e is RoutePage => e.type !== 'redirect').map((e) => [e.path, e]))

// Breadcrumb steps that are an in-page anchor rather than a page of their own. Doctor profiles sit under "Our Doctors",
// the home page's doctors section (the header's Doctors menu links there too).
export const VIRTUAL_CRUMBS: Record<string, string> = { '/#our-doctors': 'Our Doctors' }

/** The name a breadcrumb step shows, in the visible breadcrumb and the BreadcrumbList schema alike. */
export const crumbName = (path: string) => (path === '/' ? 'Home' : (VIRTUAL_CRUMBS[path] ?? pageByPath.get(path)?.name ?? path))
