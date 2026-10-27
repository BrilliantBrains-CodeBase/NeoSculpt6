// /laser-skin-aesthetic/: the Laser & Skin Aesthetics hub (brief: content/service/prompts/speciality-laser-skin-aesthetic.md).
//
// DRAFT COPY, as on the hair hub: the hub's own words are drafts for sign-off. Care is diagnosis-led: no device is
// presented as a diagnosis, and no session count, clearance, "no downtime" or "no side effects" claim is made.
//
// Groups: all 33 pages service-page.md lists under Laser & Skin Aesthetic. The source has no vascular-laser page, so
// the hair group covers hair only; the lesion and tattoo pages form the brief's "medical/aesthetic skin" group.
// Doctor: Dr Sandeep (every page in the section). Technology: CO2, Q-Switch and Excimer from the technology doc.

import { reception } from '../services/index.ts'
import type { HubSource } from './types.ts'
import { book, call, hubOrder, pendingReviews, photo as hubPhoto, pillarPhoto, sandeepCard, sharedPending, whatsapp } from './shared.ts'

const HUB = '/laser-skin-aesthetic/'
const child = (slug: string) => `${HUB}${slug}-in-bangalore/`
const photo = (file: string) => hubPhoto('laser-skin-aesthetic', file)

export const laserSkin: HubSource = {
  path: HUB,
  order: hubOrder(),

  hero: {
    eyebrow: 'Skin, Laser & Hair Reduction',
    intro:
      'Diagnosis-led skin and laser care in Whitefield, Bangalore. Treatment is chosen for your skin type, concern and history after an examination, not the other way round.',
    ctas: [book, call],
    image: pillarPhoto(HUB),
  },

  intro: {
    h2: 'Diagnosis Before Device',
    paragraphs: [
      'Acne, scars, pigmentation and unwanted hair can look alike and have different causes. At NeoSculpt6, Dr Sandeep Mahapatra examines your skin, asks about your history and previous treatment, and identifies the concern before recommending a laser, peel or other treatment.',
      'Skin type affects which treatments are suitable and how the skin may respond. Your consultation explains the options, likely aftercare and limits, and where a patch test is clinically appropriate it is done first.',
    ],
    points: [
      { title: 'Diagnosis first', text: 'The type and cause of your concern are identified before any treatment is chosen.' },
      { title: 'Skin type', text: 'Your skin type and pigment tendency guide the device, settings and aftercare.' },
      { title: 'History', text: 'Previous treatments, medicines, sun exposure and how your skin has healed before.' },
      { title: 'Suitability', text: 'Where a treatment is not right for your skin or not yet, you are told why.' },
      { title: 'Review', text: 'Response is reviewed between sessions, and the plan changes if it needs to.' },
    ],
  },

  treatments: {
    h2: 'Laser & Skin Treatments',
    subline: 'Explore each treatment, or book a consultation and let the skin assessment point you to the right one.',
    groups: [
      {
        title: 'Acne, Scars, Texture & Pores',
        text: 'Active acne, acne scars and textural concerns, each needing a different approach.',
        image: photo('acne-scar-laser-treatment-in-bangalore-1'),
        paths: [
          child('acne-treatment'),
          child('acne-scar-treatment'),
          child('acne-scar-laser-treatment'),
          child('subcision-treatment'),
          child('laser-scar-revision'),
          child('open-pores-treatment'),
          child('mnrf-treatment'),
          child('microneedling-treatment'),
          child('stretch-mark-laser-treatment'),
        ],
      },
      {
        title: 'Pigmentation & Melasma',
        text: 'Dark patches, uneven tone and tan, after the type of pigmentation is identified.',
        image: photo('melasma-treatment-in-bangalore-1'),
        paths: [
          child('pigmentation-treatment'),
          child('melasma-treatment'),
          child('q-switch-laser-treatment'),
          child('tan-removal-treatment'),
          child('skin-brightening-treatment'),
          child('dark-circle-treatment'),
        ],
      },
      {
        title: 'Laser Hair Reduction',
        text: 'Laser hair reduction for the face and body, matched to your skin and hair type.',
        image: photo('laser-hair-reduction-in-bangalore-1'),
        paths: [
          child('laser-hair-reduction'),
          child('full-body-laser-hair-removal'),
          child('facial-laser-hair-removal'),
          child('underarm-laser-hair-removal'),
          child('bikini-laser-hair-removal'),
          child('laser-hair-removal-for-men'),
          child('beard-shaping-laser'),
        ],
      },
      {
        title: 'Resurfacing & Rejuvenation',
        text: 'Resurfacing, peels and facials for texture, tone and skin quality.',
        image: photo('co2-fractional-laser-treatment-in-bangalore-1'),
        paths: [
          child('co2-fractional-laser-treatment'),
          child('laser-skin-resurfacing'),
          child('carbon-laser-peel'),
          child('chemical-peels'),
          child('hydrafacial'),
          child('microdermabrasion-treatment'),
        ],
      },
      {
        title: 'Moles, Marks & Lesion Removal',
        text: 'Moles, skin tags, warts, birthmarks and tattoos, assessed before any removal.',
        image: photo('laser-mole-removal-in-bangalore-1'),
        paths: [
          child('laser-mole-removal'),
          child('laser-skin-tag-removal'),
          child('laser-wart-removal-treatment'),
          child('laser-birthmark-removal-treatment'),
          child('laser-tattoo-removal'),
        ],
      },
    ],
  },

  concerns: {
    h2: 'Choose Your Starting Point',
    subline: 'Start with the concern closest to yours. Your consultation confirms which option, if any, suits you.',
    cards: [
      {
        title: 'Acne or acne scars',
        text: 'Breakouts, marks left behind, or uneven scarring.',
        links: [
          { label: 'Acne', href: child('acne-treatment') },
          { label: 'Acne Scars', href: child('acne-scar-treatment') },
          { label: 'Subcision', href: child('subcision-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Pigmentation',
        text: 'Dark patches, melasma, tan or uneven tone.',
        links: [
          { label: 'Pigmentation', href: child('pigmentation-treatment') },
          { label: 'Melasma', href: child('melasma-treatment') },
          { label: 'Tan Removal', href: child('tan-removal-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Unwanted hair',
        text: 'Hair on the face or body you would like reduced.',
        links: [
          { label: 'Laser Hair Reduction', href: child('laser-hair-reduction') },
          { label: 'Full Body', href: child('full-body-laser-hair-removal') },
          { label: 'For Men', href: child('laser-hair-removal-for-men') },
        ],
        cta: null,
      },
      {
        title: 'Ageing skin or texture',
        text: 'Fine lines, rough texture, open pores or dullness.',
        links: [
          { label: 'Laser Resurfacing', href: child('laser-skin-resurfacing') },
          { label: 'MNRF', href: child('mnrf-treatment') },
          { label: 'Open Pores', href: child('open-pores-treatment') },
        ],
        cta: null,
      },
      {
        title: 'A mole, mark or other concern',
        text: 'A mole, skin tag, wart, birthmark or tattoo you would like assessed.',
        links: [
          { label: 'Moles', href: child('laser-mole-removal') },
          { label: 'Skin Tags', href: child('laser-skin-tag-removal') },
          { label: 'Tattoos', href: child('laser-tattoo-removal') },
        ],
        cta: null,
      },
      {
        title: 'Not sure yet',
        text: 'Book a consultation and start with an examination of your skin.',
        links: [],
        cta: book,
      },
    ],
  },

  process: {
    eyebrow: 'Your Skin Assessment',
    h2: 'From Examination to Review',
    steps: [
      { title: 'History', text: 'Your concern, previous treatments, medicines, sun exposure and how your skin has healed before.' },
      { title: 'Examination', text: 'A close look at your skin, with magnification or imaging where useful.' },
      { title: 'Diagnosis', text: 'What the concern is and what is causing it, which decides the options.' },
      { title: 'Patch test where appropriate', text: 'A test area first when your skin type or the treatment calls for it.' },
      { title: 'Treatment plan', text: 'The suitable treatment, settings and timing, and what it can and cannot change.' },
      { title: 'Aftercare', text: 'Sun protection, skincare and what to expect in the days after treatment.' },
      { title: 'Review', text: 'Your response is checked before any further session; results vary from person to person.' },
    ],
    image: photo('pigmentation-treatment-in-bangalore-1'),
  },

  doctors: {
    eyebrow: 'Your Doctor',
    h2: 'Led by Dr Sandeep Mahapatra',
    cards: [
      sandeepCard([
        'Consultations begin with the concern, skin type, previous treatment and patient goals. The aim is to select an approach that fits the clinical findings rather than treating the procedure as a standard package.',
      ]),
    ],
  },

  technology: {
    h2: 'Laser Technology',
    subline: 'The device is chosen for your diagnosis and skin type; no number of sessions or result is promised in advance.',
    paths: ['/technology/co2-fractional-laser/', '/technology/q-switch-laser/', '/technology/excimer-laser-targeted-phototherapy/'],
  },

  cost: {
    h2: 'Laser & Skin Cost and Consultation',
    intro: 'There is no fixed price. Your cost is explained after a skin assessment, once the doctor knows what your plan involves.',
    factors: [
      { title: 'Assessment', text: 'Your diagnosis, skin type and whether a treatment is suitable.' },
      { title: 'Treatment', text: 'The device, peel or procedure your skin needs.' },
      { title: 'Area', text: 'The size and number of areas treated.' },
      { title: 'Sessions', text: 'How many sessions your plan may need, reviewed as you respond.' },
      { title: 'Aftercare', text: 'Skincare and follow-up reviews your plan includes.' },
    ],
    ctas: [book, call, whatsapp],
  },

  reviews: { h2: 'Success Stories', items: pendingReviews('Laser & Skin Aesthetics', ['Laser Treatment', 'Skin Treatment', 'Dr Sandeep Mahapatra by name']) },

  faqs: {
    eyebrow: 'Quick Answers',
    h2: 'Laser & Skin FAQs',
    items: [
      {
        q: 'Why do I need a consultation before laser treatment?',
        a: 'Many skin concerns look alike but have different causes. The doctor diagnoses the concern and checks your skin type and history first, because they decide which treatment is suitable and how your skin may respond.',
      },
      {
        q: 'Is laser treatment suitable for my skin type?',
        a: 'Many treatments can be adapted to different skin types, but settings, timing and aftercare differ. Your doctor explains what suits your skin and whether a patch test is needed first.',
      },
      {
        q: 'How many sessions will I need?',
        a: 'It depends on the concern, your skin and how it responds, so the number is not fixed in advance. Your response is reviewed between sessions.',
      },
      {
        q: 'Will there be redness or downtime?',
        a: 'Some treatments cause temporary redness, peeling or darkening, and stronger treatments need more recovery. Your doctor explains what to expect for your plan, along with aftercare.',
      },
      {
        q: 'Can a mole or mark be removed straight away?',
        a: 'A mole or lesion is examined first. Some need further assessment before any removal, and the doctor explains the right next step.',
      },
      {
        q: 'How much does treatment cost?',
        a: 'Cost depends on your assessment, the treatment, the area, the number of sessions and aftercare, so it is explained after your consultation rather than quoted in advance.',
      },
    ],
    cta: book,
  },
  faqsApproved: false,

  closing: {
    kicker: 'Start with a skin assessment',
    h2: 'Book Your Skin Consultation',
    paragraph: 'Meet the doctor, have your skin examined, and leave with a clear explanation of your options and aftercare at NeoSculpt6, Whitefield, Bangalore.',
    chips: [],
    ctas: [book, call],
    image: reception,
  },

  pending: [
    ...sharedPending,
    'no vascular-laser page exists in service-page.md, so the hair group covers hair only; add one if the clinic offers it',
    'technology: CO2 and Q-Switch card photos are old-site placeholders (technology hub)',
    'doctor: portrait is the old-site placeholder (services/index.ts)',
  ],
}
