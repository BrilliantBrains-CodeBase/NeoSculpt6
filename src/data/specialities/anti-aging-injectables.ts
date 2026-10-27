// /anti-aging-injectables/: the Anti-Ageing & Injectables hub
// (brief: content/service/prompts/speciality-anti-aging-injectables.md).
//
// DRAFT COPY, as on the hair hub: the hub's own words are drafts for sign-off. Anatomy-led and measured: no
// "frozen", "painless", "zero downtime", guaranteed longevity or universal-safety claims, and no product, brand or
// device is described as suitable for everyone. Product names are the child pages' own (their URLs and titles).
//
// Groups: all 35 pages service-page.md lists under Anti-Aging & Injectables. The body-filler and IV-drip pages form
// the brief's "body or specialist injectable pathways" group. Doctor: Dr Sandeep (every page in the section).
// Technology: Reaction Viora RF, the only technology-doc entry for this speciality.

import { reception } from '../services/index.ts'
import type { HubSource } from './types.ts'
import { book, call, hubOrder, pendingReviews, photo as hubPhoto, pillarPhoto, sandeepCard, sharedPending, whatsapp } from './shared.ts'

const HUB = '/anti-aging-injectables/'
const child = (slug: string) => `${HUB}${slug}-in-bangalore/`
const photo = (file: string) => hubPhoto('anti-aging-injectables', file)

export const antiAgeing: HubSource = {
  path: HUB,
  order: hubOrder(),

  hero: {
    eyebrow: 'Injectables, Skin Quality & Tightening',
    intro:
      'Anti-ageing care in Whitefield, Bangalore, planned around your anatomy and what you would like to change. Every treatment starts with an assessment, and nothing is recommended before it.',
    ctas: [book, call],
    image: pillarPhoto(HUB),
  },

  intro: {
    h2: 'Measured, Anatomy-Led Planning',
    paragraphs: [
      'Lines from movement, lost volume, skin quality and laxity are different concerns, and each responds to a different kind of treatment. At NeoSculpt6, Dr Sandeep Mahapatra assesses your face or treatment area, your history and previous treatments before recommending anything.',
      'The aim is a proportionate change that suits your face and age. Your consultation explains the suitable options, how long effects may last, the risks and aftercare, so you can decide with clear information.',
    ],
    points: [
      { title: 'Facial assessment', text: 'Anatomy, movement, volume and skin quality are assessed together.' },
      { title: 'History', text: 'Previous injectables, medicines and health conditions that affect suitability.' },
      { title: 'Measured planning', text: 'Conservative, proportionate plans rather than a fixed package.' },
      { title: 'Consent', text: 'Products, risks, limits and aftercare explained before you decide.' },
      { title: 'Review', text: 'A follow-up to check your response before any further treatment.' },
    ],
  },

  treatments: {
    h2: 'Anti-Ageing & Injectable Treatments',
    subline: 'Explore each treatment, or book a consultation and let the assessment point you to the right one.',
    groups: [
      {
        title: 'Neuromodulators',
        text: 'For selected lines caused by facial movement.',
        image: photo('botox-treatment-in-bangalore-1'),
        paths: [child('botox-treatment'), child('fine-line-treatment'), child('wrinkle-treatment')],
      },
      {
        title: 'Dermal Fillers & Facial Balancing',
        text: 'Volume and proportion for the cheeks, lips, chin, jawline, nose, under-eyes and hands.',
        image: photo('jawline-fillers-in-bangalore-1'),
        paths: [
          child('dermal-filler-treatment'),
          child('cheek-fillers'),
          child('chin-fillers'),
          child('jawline-fillers'),
          child('lip-fillers'),
          child('nose-fillers'),
          child('under-eye-fillers'),
          child('facial-volume-restoration'),
          child('hand-rejuvenation-fillers'),
        ],
      },
      {
        title: 'Biostimulators & Skin Quality',
        text: 'Injectable treatments aimed at hydration, texture and skin quality.',
        image: photo('profhilo-in-bangalore-1'),
        paths: [
          child('profhilo'),
          child('skin-boosters-treatment'),
          child('skin-vive'),
          child('pdrn-treatment'),
          child('salmon-dna-treatment'),
          child('collagen-boosters'),
          child('collagen-stimulation-treatment'),
          child('skin-elasticity-treatment'),
          child('skin-rejuvenation-treatment'),
        ],
      },
      {
        title: 'Tightening, Lifting & Rejuvenation',
        text: 'Energy-based tightening and non-surgical lifting for selected laxity.',
        image: photo('hifu-treatment-in-bangalore-1'),
        paths: [
          child('hifu-treatment'),
          child('rf-skin-tightening-treatment'),
          child('neck-tightening-treatment'),
          child('non-surgical-double-chin-tightening-treatment'),
          child('non-surgical-face-lift'),
          child('thread-lift-treatment'),
          child('anti-ageing-treatment'),
        ],
      },
      {
        title: 'Body & Specialist Pathways',
        text: 'Body fillers and IV drips, considered only after a medical assessment.',
        image: photo('glutathione-iv-drip-treatment-in-bangalore-1'),
        paths: [
          child('body-fillers'),
          child('breast-volume-enhancement-fillers'),
          child('buttock-volume-enhancement-fillers'),
          child('glutathione-iv-drip-treatment'),
          child('nad-iv-drips'),
          child('skin-rejuvenation-drips'),
          child('anti-aging-wellness-drips'),
        ],
      },
    ],
  },

  concerns: {
    h2: 'Choose Your Starting Point',
    subline: 'Start with the concern closest to yours. Your consultation confirms which option, if any, suits you.',
    cards: [
      {
        title: 'Lines from movement',
        text: 'Frown lines, forehead lines or crow’s feet.',
        links: [
          { label: 'Botox', href: child('botox-treatment') },
          { label: 'Fine Lines', href: child('fine-line-treatment') },
          { label: 'Wrinkles', href: child('wrinkle-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Volume or profile',
        text: 'Lost volume, or the balance of the lips, cheeks, chin or jawline.',
        links: [
          { label: 'Dermal Fillers', href: child('dermal-filler-treatment') },
          { label: 'Lips', href: child('lip-fillers') },
          { label: 'Jawline', href: child('jawline-fillers') },
          { label: 'Under-Eye', href: child('under-eye-fillers') },
        ],
        cta: null,
      },
      {
        title: 'Skin quality',
        text: 'Dryness, dullness, crepiness or uneven texture.',
        links: [
          { label: 'Profhilo', href: child('profhilo') },
          { label: 'Skin Boosters', href: child('skin-boosters-treatment') },
          { label: 'PDRN', href: child('pdrn-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Laxity',
        text: 'Looser skin along the jawline, neck or under the chin.',
        links: [
          { label: 'HIFU', href: child('hifu-treatment') },
          { label: 'RF Tightening', href: child('rf-skin-tightening-treatment') },
          { label: 'Thread Lift', href: child('thread-lift-treatment') },
        ],
        cta: null,
      },
      {
        title: 'A body concern',
        text: 'Volume or skin concerns beyond the face, such as the hands or body.',
        links: [
          { label: 'Hand Rejuvenation', href: child('hand-rejuvenation-fillers') },
          { label: 'Body Fillers', href: child('body-fillers') },
        ],
        cta: null,
      },
      {
        title: 'Not sure yet',
        text: 'Book a consultation and start with an assessment of your face or treatment area.',
        links: [],
        cta: book,
      },
    ],
  },

  process: {
    eyebrow: 'Your Consultation',
    h2: 'From Assessment to Review',
    steps: [
      { title: 'History', text: 'Your health, medicines, allergies and any previous injectable or energy-based treatment.' },
      { title: 'Facial assessment', text: 'Anatomy, movement, volume, skin quality and laxity, and what you would like to change.' },
      { title: 'Suitability', text: 'Whether a treatment suits you now, and when another option or no treatment is better.' },
      { title: 'Product or procedure plan', text: 'The suitable product or device, the areas and a conservative amount.' },
      { title: 'Consent', text: 'Risks, how long effects may last and their limits, explained before treatment.' },
      { title: 'Aftercare', text: 'What to do and avoid in the days after treatment, and who to contact with a concern.' },
      { title: 'Review', text: 'A follow-up to check your response; results and how long they last vary between people.' },
    ],
    image: photo('anti-ageing-treatment-in-bangalore-1'),
  },

  doctors: {
    eyebrow: 'Your Doctor',
    h2: 'Led by Dr Sandeep Mahapatra',
    cards: [
      sandeepCard([
        'Consultations focus on facial movement, anatomy, tissue quality, previous injectable treatment, medical history and the proportionate change the patient wants. Treatment is an individual clinical decision, not a promise of a fixed dose, duration or result.',
      ]),
    ],
  },

  technology: {
    h2: 'Technology & Products',
    subline: 'No product, brand or device suits everyone; the choice follows your assessment.',
    paths: ['/technology/reaction-viora-rf-tightening/'],
  },

  cost: {
    h2: 'Anti-Ageing Cost and Consultation',
    intro: 'There is no fixed price. Your cost is explained after an assessment, once the doctor knows what your plan involves.',
    factors: [
      { title: 'Assessment', text: 'Your concern, anatomy and whether a treatment is suitable.' },
      { title: 'Product or device', text: 'The product or technology your plan uses.' },
      { title: 'Areas', text: 'How many areas are treated.' },
      { title: 'Amount and sessions', text: 'The amount of product, or number of sessions, your plan needs.' },
      { title: 'Review', text: 'Follow-up appointments included in your plan.' },
    ],
    ctas: [book, call, whatsapp],
  },

  reviews: { h2: 'Success Stories', items: pendingReviews('Anti-Ageing & Injectables', ['Anti-Ageing Treatment', 'Injectables', 'Dr Sandeep Mahapatra by name']) },

  faqs: {
    eyebrow: 'Quick Answers',
    h2: 'Anti-Ageing FAQs',
    items: [
      {
        q: 'How do I know which treatment suits me?',
        a: 'Lines from movement, lost volume, skin quality and laxity each respond to different treatments. The doctor assesses your face or treatment area and explains which options may suit you and why.',
      },
      {
        q: 'Will I look natural?',
        a: 'Plans aim for a proportionate change that suits your face and age, using conservative amounts. How you respond varies, and a review appointment checks the result.',
      },
      {
        q: 'How long do results last?',
        a: 'It depends on the treatment, the product, the area and your body. Your doctor explains a realistic range for your plan rather than a fixed time.',
      },
      {
        q: 'Are there side effects?',
        a: 'Injectables and energy-based treatments can cause temporary swelling, redness or bruising, and rarer risks that are explained at consultation. Aftercare and who to contact are part of your plan.',
      },
      {
        q: 'Are body fillers and IV drips suitable for everyone?',
        a: 'No. They are considered only after a medical assessment of your health, history and goals, and may not be appropriate for you.',
      },
      {
        q: 'How much does treatment cost?',
        a: 'Cost depends on your assessment, the product or device, the areas, the amount or number of sessions, and follow-up, so it is explained after your consultation rather than quoted in advance.',
      },
    ],
    cta: book,
  },
  faqsApproved: false,

  closing: {
    kicker: 'Start with an assessment',
    h2: 'Book Your Anti-Ageing Consultation',
    paragraph: 'Meet the doctor, have your concern assessed, and leave with a clear explanation of your options, risks and aftercare at NeoSculpt6, Whitefield, Bangalore.',
    chips: [],
    ctas: [book, call],
    image: reception,
  },

  pending: [
    ...sharedPending,
    'product names (Botox, Profhilo, Skin Vive, PDRN, Salmon DNA and others) and their indications need doctor and brand approval',
    'medical sign-off: body fillers and IV drips (breast and buttock fillers, glutathione, NAD) wording',
    'doctor: portrait is the old-site placeholder (services/index.ts)',
  ],
}
