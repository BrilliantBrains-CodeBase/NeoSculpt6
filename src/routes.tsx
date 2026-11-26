import type { RouteRecord } from 'vite-react-ssg'
import { entries } from './data/entries'
import { SiteLayout } from './layouts/SiteLayout'
import { PageShell } from './components/PageShell'
import { RedirectPage } from './components/RedirectPage'
import { NotFound } from './components/NotFound'

const children: RouteRecord[] = entries.map((entry) => {
  const element = entry.type === 'redirect' ? <RedirectPage entry={entry} /> : <PageShell page={entry} />
  // Router paths drop the slashes; dirStyle "nested" writes /foo/ as dist/foo/index.html.
  return entry.path === '/' ? { index: true, element } : { path: entry.path.slice(1, -1), element }
})

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      ...children,
      { path: '404', element: <NotFound /> }, // prerendered; postbuild copies it to dist/404.html
      { path: '*', element: <NotFound /> },
    ],
  },
]
