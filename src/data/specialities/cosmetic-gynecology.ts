// /cosmetic-gynecology/: the Cosmetic Gynaecology hub (brief: content/service/prompts/speciality-cosmetic-gynecology.md).
//
// DRAFT COPY, as on the hair hub: the hub's own words are drafts for sign-off. Calm and neutral: no assumptions about
// anatomy, gender, goals or diagnosis; concern cards are plain links and collect nothing. Booking uses the shared
// popup, whose service option for this speciality reads "Private consultation" (nav.ts), so the WhatsApp message
// never names an intimate concern.
//
// Groups: all 12 pages service-page.md lists under Cosmetic Gynecology. Photos are consultation scenes only (a doctor
// and a patient talking at a desk), never a treatment bed. No technology-doc entry covers this speciality, so the
// technology section is left out.
// Doctor: Dr Sandeep, as service-page.md assigns him (user decision, 2026-10-27). The paragraph follows the child
// pages, which say a dedicated gynaecological or specialist opinion is arranged where needed and do not claim he
// performs every procedure.

import { reception } from '../services/index.ts'
import type { HubSource } from './types.ts'
import { book, call, hubOrder, pendingReviews, photo as hubPhoto, sandeepCard, sharedPending, whatsapp } from './shared.ts'

const HUB = '/cosmetic-gynecology/'
const child = (slug: string) => `${HUB}${slug}-in-bangalore/`
const photo = (file: string) => hubPhoto('cosmetic-gynecology', file)

export const gynaecology: HubSource = {
  path: HUB,
  order: hubOrder({ technology: false }),

  hero: {
    eyebrow: 'Private, One-to-One Care',
    intro:
      'Confidential consultations for intimate and post-pregnancy concerns in Whitefield, Bangalore. You choose what to share and when, and nothing is recommended before a private assessment.',
    ctas: [book, call],
    image: { ...photo('intimate-pigmentation-treatment-in-bangalore-1'), position: '50% 35%' },
  },

  intro: {
    h2: 'A Private, Respectful Consultation',
    paragraphs: [
      'Intimate concerns are personal, and they can be medical, functional or cosmetic. At NeoSculpt6 the first step is a private, one-to-one consultation that clarifies your concern, your history and what you would like to change.',
      'Where a concern needs a gynaecological, pelvic-floor, urinary or other medical opinion, that is identified before any treatment is planned. Your consultation explains the options, the alternatives and their limits, so you can decide without pressure.',
    ],
    points: [
      { title: 'Confidential', text: 'Your enquiry and consultation are handled privately.' },
      { title: 'One-to-one', text: 'A private conversation at your pace; you share only what you choose to.' },
      { title: 'Medical first', text: 'Symptoms that need medical evaluation are identified before cosmetic options.' },
      { title: 'Alternatives', text: 'Non-surgical, surgical and no-treatment options are discussed side by side.' },
      { title: 'Consent', text: 'Risks, recovery and limits explained before any decision.' },
    ],
  },

  treatments: {
    h2: 'Cosmetic Gynaecology Treatments',
    subline: 'Read about each treatment privately, or book a consultation and start with a conversation.',
    groups: [
      {
        title: 'Intimate Skin, Laser & Energy-Based Care',
        text: 'Non-surgical options for skin tone and tissue changes, after an assessment.',
        image: photo('pain-during-intimacy-treatment-in-bangalore-1'),
        paths: [
          child('intimate-pigmentation-treatment'),
          child('intimate-laser-treatment'),
          child('laser-vaginal-tightening'),
          child('vaginal-rejuvenation-treatment'),
        ],
      },
      {
        title: 'Intimate Surgery',
        text: 'Elective procedures, considered only after a private consultation and, where needed, a specialist opinion.',
        image: photo('labiaplasty-surgery-in-bangalore-1'),
        paths: [
          child('labiaplasty-surgery'),
          child('clitoral-hood-reduction-surgery'),
          child('monsplasty-mons-pubis-reduction'),
          child('perineoplasty-surgery'),
          child('hymenoplasty-surgery'),
        ],
      },
      {
        title: 'Functional & Post-Pregnancy Concerns',
        text: 'Symptoms such as dryness, leakage or discomfort, which start with a medical assessment.',
        image: photo('vaginal-dryness-treatment-in-bangalore-1'),
        paths: [child('urinary-incontinence-treatment'), child('vaginal-dryness-treatment'), child('pain-during-intimacy-treatment')],
      },
    ],
  },

  concerns: {
    h2: 'Choose Your Starting Point',
    subline: 'These links only open information pages; nothing you click is recorded or shared.',
    cards: [
      {
        title: 'Skin tone',
        text: 'Darker skin in the bikini, groin or inner-thigh area.',
        links: [{ label: 'Intimate Pigmentation', href: child('intimate-pigmentation-treatment') }],
        cta: null,
      },
      {
        title: 'Changes after childbirth or with age',
        text: 'Tissue changes after pregnancy, menopause or with time.',
        links: [
          { label: 'Vaginal Rejuvenation', href: child('vaginal-rejuvenation-treatment') },
          { label: 'Laser Tightening', href: child('laser-vaginal-tightening') },
          { label: 'Perineoplasty', href: child('perineoplasty-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Comfort or symptoms',
        text: 'Dryness, discomfort or pain during intimacy.',
        links: [
          { label: 'Vaginal Dryness', href: child('vaginal-dryness-treatment') },
          { label: 'Pain During Intimacy', href: child('pain-during-intimacy-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Bladder leakage',
        text: 'Leaking urine when coughing, laughing or exercising.',
        links: [{ label: 'Urinary Incontinence', href: child('urinary-incontinence-treatment') }],
        cta: null,
      },
      {
        title: 'Shape or appearance',
        text: 'A concern about size, shape or symmetry.',
        links: [
          { label: 'Labiaplasty', href: child('labiaplasty-surgery') },
          { label: 'Clitoral Hood Reduction', href: child('clitoral-hood-reduction-surgery') },
          { label: 'Monsplasty', href: child('monsplasty-mons-pubis-reduction') },
        ],
        cta: null,
      },
      {
        title: 'I am not sure',
        text: 'Book a private consultation; you do not need to describe your concern to book.',
        links: [],
        cta: book,
      },
    ],
  },

  process: {
    eyebrow: 'Your Consultation',
    h2: 'From Private Enquiry to Follow-Up',
    steps: [
      { title: 'Confidential enquiry', text: 'Book by phone, WhatsApp or the booking form; choose “Private consultation” and share details only in person.' },
      { title: 'One-to-one assessment', text: 'A private conversation about your concern and history, and an examination only with your consent.' },
      { title: 'Suitability and alternatives', text: 'Whether a treatment suits you, whether a medical or specialist opinion is needed first, and the alternatives.' },
      { title: 'Consent', text: 'Risks, recovery and limits explained, with time for your questions before you decide.' },
      { title: 'Recovery and aftercare', text: 'Clear aftercare guidance for the option you choose, and who to contact with a concern.' },
      { title: 'Follow-up', text: 'Review appointments to check your recovery and comfort; results vary from person to person.' },
    ],
    image: photo('hymenoplasty-surgery-in-bangalore-1'),
  },

  doctors: {
    eyebrow: 'Your Doctor',
    h2: 'Careful Assessment First',
    cards: [
      sandeepCard([
        'His role is centred on careful assessment, realistic expectations, safety, consent and clear next-step guidance. Where a concern needs a dedicated gynaecological or specialist opinion, that need is identified before any treatment proceeds.',
      ]),
    ],
  },

  technology: { h2: 'Technology & Infrastructure', subline: '', paths: [] },

  cost: {
    h2: 'Cosmetic Gynaecology Cost and Consultation',
    intro:
      'There is no fixed price, and costs differ between an assessment and a treatment. Your cost is explained privately after your consultation, and your enquiry is handled confidentially.',
    factors: [
      { title: 'Assessment', text: 'Your concern and whether a medical or specialist opinion is needed first.' },
      { title: 'Treatment type', text: 'A non-surgical treatment, a procedure, or medical care.' },
      { title: 'Sessions', text: 'How many sessions a non-surgical plan may need.' },
      { title: 'Anaesthesia and stay', text: 'What a procedure needs, if one is suitable.' },
      { title: 'Follow-up', text: 'Review appointments and aftercare.' },
    ],
    ctas: [book, call, whatsapp],
  },

  reviews: { h2: 'Success Stories', items: pendingReviews('Cosmetic Gynaecology', ['Private consultation', 'Intimate wellness care', 'Dr Sandeep Mahapatra by name']) },

  faqs: {
    eyebrow: 'Quick Answers',
    h2: 'Cosmetic Gynaecology FAQs',
    items: [
      {
        q: 'Is my consultation confidential?',
        a: 'Yes. Your enquiry and consultation are handled privately. When you book, you can choose “Private consultation” and keep the details for the appointment itself.',
      },
      {
        q: 'Do I need to describe my concern to book?',
        a: 'No. You can book a private consultation without describing your concern, and talk it through one-to-one.',
      },
      {
        q: 'Will I need an examination?',
        a: 'An examination is sometimes needed to assess a concern, and it happens only with your consent, after the reasons have been explained.',
      },
      {
        q: 'Is surgery always necessary?',
        a: 'No. Many concerns are first assessed medically, and non-surgical options or no treatment may be more suitable. Surgery is one option among several and is discussed only when appropriate.',
      },
      {
        q: 'What if my symptom needs another specialist?',
        a: 'Where a concern needs a gynaecological, pelvic-floor, urinary or other medical evaluation, that is identified at consultation before any cosmetic treatment is planned.',
      },
      {
        q: 'How much does treatment cost?',
        a: 'Cost depends on your assessment, the type of treatment, the number of sessions or what a procedure needs, and follow-up, so it is explained privately after your consultation.',
      },
    ],
    cta: book,
  },
  faqsApproved: false,

  closing: {
    kicker: 'Start with a private conversation',
    h2: 'Book a Private Consultation',
    paragraph: 'Talk to the clinic one-to-one, at your pace, and leave with a clear explanation of your options at NeoSculpt6, Whitefield, Bangalore.',
    chips: [],
    ctas: [book, call],
    image: reception,
  },

  pending: [
    ...sharedPending,
    'clinical sign-off: the hub’s wording on surgery, examination and specialist referral',
    'doctor: service-page.md names Dr Sandeep on all 12 pages; confirm who assesses and performs each pathway (the brief warns against inferring a provider)',
    'photos: the consultation photos show a female doctor, while the doctor card is Dr Sandeep; confirm the photos are suitable',
    'technology: the technology doc has no entry for this speciality, so the section is hidden',
    'banner: a consultation photo is used instead of the home pillar photo (a woman making a heart shape over her stomach), per the brief’s non-identifying imagery rule',
    'doctor: portrait is the old-site placeholder (services/index.ts)',
  ],
}
