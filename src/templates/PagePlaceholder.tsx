import type { TemplateProps } from '../components/PageShell'

// Empty page body: only the H1, so each route can be checked in the browser. Replace per template.
export function PagePlaceholder({ page, template }: TemplateProps & { template: string }) {
  return (
    <section data-template={template} className="mx-auto max-w-site px-4 py-24">
      <h1 className="font-heading text-h1 uppercase text-secondary">{page.h1}</h1>
    </section>
  )
}
