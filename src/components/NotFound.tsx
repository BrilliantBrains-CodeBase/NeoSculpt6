import { Head } from 'vite-react-ssg'
import { Link } from 'react-router-dom'
import { SITE_NAME } from '../data/site'

export function NotFound() {
  return (
    <>
      <Head>
        <title>{`Page Not Found | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <section className="mx-auto max-w-site px-4 pt-[calc(var(--header-offset)+6rem)] pb-24">
        <h1 className="font-heading text-h1 uppercase text-secondary">Page Not Found</h1>
        <Link to="/" className="mt-6 inline-block text-button uppercase text-primary">
          Back to home
        </Link>
      </section>
    </>
  )
}
