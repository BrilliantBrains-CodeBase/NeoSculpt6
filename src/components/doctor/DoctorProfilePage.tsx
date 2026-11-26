import { Fragment, type ReactNode } from 'react'
import type { RoutePage } from '../../data/types'
import { doctorSections, type Doctor, type DoctorSectionId } from '../../data/doctors'
import { InstagramStrip } from '../InstagramStrip'
import { DoctorHero } from './DoctorHero'
import { DoctorPhilosophy } from './DoctorPhilosophy'
import { DoctorExpertise } from './DoctorExpertise'
import { DoctorCredentials } from './DoctorCredentials'
import { DoctorMetrics } from './DoctorMetrics'
import { DoctorProcess } from './DoctorProcess'
import { DoctorBooking } from './DoctorBooking'

// Every doctor profile (content/doctor/prompts/doctor-page-boilerplate.md): one record from src/data/doctors.json,
// the same sections in the same order for every doctor. The order and which sections have approved content to show
// come from `doctorSections` (data/doctors.ts), which verify-seo.mjs checks against the built page. Nothing here
// depends on which doctor it is. The header, footer and floating actions are SiteLayout's.

export function DoctorProfilePage({ doctor, page }: { doctor: Doctor; page: RoutePage }) {
  const sections: Record<DoctorSectionId, ReactNode> = {
    'doctor-hero': <DoctorHero doctor={doctor} page={page} />,
    'doctor-philosophy': <DoctorPhilosophy doctor={doctor} />,
    'doctor-expertise': <DoctorExpertise doctor={doctor} />,
    'doctor-credentials': <DoctorCredentials doctor={doctor} />,
    'doctor-metrics': <DoctorMetrics doctor={doctor} />,
    'doctor-process': <DoctorProcess doctor={doctor} />,
    'doctor-booking': <DoctorBooking doctor={doctor} />,
    instagram: <InstagramStrip />,
  }
  return (
    <>
      {doctorSections(doctor).map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  )
}
