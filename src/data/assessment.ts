// Free AI Hair Assessment (/hair-assessment/, src/templates/AssessmentTemplate.tsx). Copy rebuilt from the sister site's
// neofollicletransplant.com/hair-assessment/ (its Landbot chat asks age, gender, then guided scalp photos and emails a
// report); here it is NeoSculpt6's own form, sent to the Apps Script backend (apps-script/Assessment.gs), which has
// Claude grade the photos and emails the report.
// Drafted here, pending approval: the two optional questions (`duration`, `treatment`) and the result disclaimer.

export const intro = {
  eyebrow: 'Doctor-Reviewed · Free',
  heading: 'Check Your Hair Loss Grade in a Few Minutes',
  lede: 'Answer a short set of questions and upload a photo. You will get an assessment of your hair loss pattern and an indication of what treatment may suit you.',
  steps: [
    { title: 'Take a photo', body: 'Upload clear photos of your hairline, crown and donor area.' },
    { title: 'AI analyses it', body: 'The assessment reviews your pattern, density and stage of hair loss.' },
    { title: 'Get your report', body: 'Receive your report by email, then talk it through with our team.' },
  ],
  start: 'Start Free Hair Assessment',
  note: 'Takes about 3 minutes. No payment required.',
}

export type Gender = 'Male' | 'Female'

export const genders: Gender[] = ['Male', 'Female']

// Optional questions (drafts). The values are sent as-is; apps-script/Assessment.gs accepts only these.
export const durations = ['Less than a year', '1–3 years', '3–5 years', 'More than 5 years']
export const treatments = ['Nothing yet', 'Minoxidil or finasteride', 'PRP / GFC or other injections', 'A hair transplant before']

export type PhotoView = 'front' | 'top' | 'back' | 'parting'

export interface PhotoStep {
  view: PhotoView
  title: string
  tips: string[]
  // The donor (back) photo is the hardest to take alone, so it can be skipped; the doctor checks it in person.
  optional?: boolean
}

const light = 'Stand in a brightly lit room, facing the light.'
const camera = 'Use a selfie or the back camera; ask someone to help if that is easier.'

export const photoSteps: Record<Gender, PhotoStep[]> = {
  Male: [
    { view: 'front', title: 'Your hairline', tips: [light, 'Face the camera and push your hair back off your forehead.', camera] },
    { view: 'top', title: 'The top of your head (crown)', tips: [light, 'Tilt your head down and hold the phone above it.', 'Keep the whole top of the head in the frame.'] },
    { view: 'back', title: 'The back of your head (donor area)', tips: [light, 'Show the back and lower sides of your head.', camera], optional: true },
  ],
  Female: [
    { view: 'front', title: 'Your hairline', tips: [light, 'Face the camera and pull your hair back off your forehead.', camera] },
    { view: 'parting', title: 'Your centre parting', tips: [light, 'Part your hair down the middle and tilt your head down.', 'Hold the phone above, so the full length of the parting shows.'] },
    { view: 'back', title: 'The back of your head', tips: [light, 'Hair down and loose; show the back and lower sides.', camera], optional: true },
  ],
}

export const contact = {
  heading: 'Where should we send your report?',
  lede: 'Your report goes to your email. Our team may also call or WhatsApp you to talk it through.',
  consent:
    'I agree that NeoSculpt6 may store my answers and photos, have them analysed by an AI service and reviewed by its doctors, and contact me about my assessment.',
}

export const result = {
  disclaimer:
    'This is a preliminary, AI-assisted screening from your photos, not a diagnosis. Only an in-person consultation with our doctor can confirm the cause of your hair loss and the right treatment.',
  pendingHeading: 'Your photos are with our team',
  pending:
    'We have your answers and photos. Our doctors will review them and email your report shortly. If anything is unclear we will call or WhatsApp you.',
}
