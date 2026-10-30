import type { TemplateProps } from '../components/PageShell'
import { doctorByPath } from '../data/doctors'
import { DoctorProfilePage } from '../components/doctor/DoctorProfilePage'
import { NotFound } from '../components/NotFound'

// Doctor profiles. Every doctor route renders the same page from its record in src/data/doctors.json (routes come
// from the same records, via generate-pages.mjs). A doctor route with no published record is a not-found page, never
// another doctor's profile.
export function DoctorTemplate({ page }: TemplateProps) {
  const doctor = doctorByPath.get(page.path)
  if (!doctor) return <NotFound />
  return <DoctorProfilePage doctor={doctor} page={page} />
}
