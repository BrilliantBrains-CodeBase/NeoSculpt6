// /hair-transplant-restoration/: the Hair Transplant & Restoration hub
// (brief: content/service/prompts/speciality-hair-transplant-restoration.md).
//
// DRAFT COPY: there is no approved hub doc. Every heading, intro, concern card, process step, cost line and FAQ
// written for this page is a draft for sign-off, kept to what the child pages already say (service-page.md) and
// qualified the same way: no outcomes, prices, graft numbers, reviews or credentials that are not signed off.
// What is NOT drafted: the treatment cards (each child page's own banner wording, via index.ts), the technology
// cards (the technology hub's, technology-international-patient.md) and the doctor paragraph (the hair pages' own).
//
// Doctor: only facts that need no sign-off. The hair pages' chips ("20+ years", "10,000+ transplants", degrees) are †
// in src/data/about.ts and stay off this page.
//
// Photos: the banner is the speciality's Treatment Pillars photo (home.ts `pillars`, the same file and alt); the
// group and process photos are NeoSculpt6's own (new-photos.json), picked by hand so each fits its group, and none is
// an Instagram tile, a technology card's photo or used twice on the page.

import { reception } from '../services/index.ts'
import type { HubSource } from './types.ts'
import { book, call, hubOrder, pillarPhoto, photo as hubPhoto, sandeepCard, sharedPending, whatsapp } from './shared.ts'
import { reviewsForPath } from '../reviews.ts'

const HUB = '/hair-transplant-restoration/'
const child = (slug: string) => `${HUB}${slug}-in-bangalore/`
const photo = (file: string) => hubPhoto('hair-transplant-restoration', file)

/** The hub before index.ts fills each group's `items` from the child pages (paths only here). */
export const hair: HubSource = {
  path: HUB,
  order: hubOrder(),

  hero: {
    eyebrow: 'Hair Restoration',
    intro:
      'Doctor-led hair restoration in Whitefield, Bangalore. Every plan starts with an assessment of your hair loss, scalp and donor area, so the technique is chosen for you rather than the other way round.',
    ctas: [book, call],
    image: pillarPhoto(HUB),
  },

  intro: {
    h2: 'Hair Restoration Planned Around You',
    paragraphs: [
      'Hair loss has many causes, and the right next step depends on what is driving it, how much donor hair you have and how your hair may change over the years. At NeoSculpt6, Dr Sandeep Mahapatra assesses each of these before recommending a transplant, a non-surgical treatment or a combination.',
      'Suitability, the technique used and the result you can expect vary from person to person. Your consultation explains your options, their limits and what recovery involves, so you can decide with clear information.',
    ],
    points: [
      { title: 'Doctor-led assessment', text: 'Your history, pattern of loss and scalp are reviewed by the doctor who plans your treatment.' },
      { title: 'Donor-area evaluation', text: 'How much donor hair can be used safely, now and for future sessions, guides every plan.' },
      { title: 'Hairline planning', text: 'Shape, density and direction are designed to suit your face and age.' },
      { title: 'Restoration options', text: 'Transplant techniques, non-surgical scalp care, or a combination, discussed side by side.' },
      { title: 'Suitability first', text: 'Where a procedure is not the right step yet, you are told why and what may help instead.' },
    ],
  },

  treatments: {
    h2: 'Hair Restoration Treatments',
    subline: 'Explore each treatment, or book a consultation and let the assessment point you to the right one.',
    groups: [
      {
        title: 'Hair Transplant & Restoration',
        text: 'Transplants planned around the area of loss, your hair type and your circumstances.',
        image: photo('neo-follicle-hair-transplant-in-bangalore-1'),
        paths: [
          child('crown-hair-transplant'),
          child('temple-hair-transplant'),
          child('female-hair-transplant'),
          child('body-hair-transplant'),
          child('unshaven-hair-transplant'),
          child('celebrity-hair-transplant'),
          child('nri-hair-transplant-consultation'),
        ],
      },
      {
        title: 'DHI, FUE, NFT & Robotic Options',
        text: 'Ways of harvesting and implanting grafts, chosen for your hair and donor area rather than a technique’s name.',
        image: photo('neo-follicle-hair-transplant-in-bangalore-2'),
        paths: [
          child('neo-follicle-hair-transplant'),
          child('fue-hair-transplant'),
          child('dhi-hair-transplant'),
          child('direct-hair-transplant'),
          '/technology/artas-robotic-hair-transplant/',
        ],
      },
      {
        title: 'Beard, Moustache, Eyebrow & Transgender Hair Restoration',
        text: 'Facial hair and hairline work where shape, angle and density matter as much as coverage.',
        image: photo('beard-moustache-transplant-in-bangalore-1'),
        paths: [child('beard-moustache-transplant'), child('eyebrow-hair-transplant'), child('transgender-hair-transplant')],
      },
      {
        title: 'Non-Surgical Hair & Scalp Care',
        text: 'Options for some forms of thinning and shedding, and for the look of density, after a hair and scalp assessment.',
        image: photo('prp-hair-treatment-in-bangalore-1'),
        paths: [
          child('prp-hair-treatment'),
          child('gfc-hair-treatment'),
          child('qr678-hair-regrowth-treatment'),
          child('exosome-hair-therapy'),
          child('hair-fillers-treatment'),
          child('low-level-laser-hair-therapy-lllt'),
          child('neo-follicle-stem-cell-therapy'),
          child('scalp-micropigmentation-smp'),
        ],
      },
      {
        title: 'Repair & Corrective Pathways',
        text: 'Assessment and planning for earlier transplants that did not go as hoped, and for hair lost to scarring.',
        image: photo('failed-hair-transplant-repair-in-bangalore-1'),
        paths: [child('failed-hair-transplant-repair'), child('burn-scar-hair-transplant')],
      },
    ],
  },

  concerns: {
    h2: 'Choose Your Starting Point',
    subline: 'Start with the concern closest to yours. Your consultation confirms which option, if any, suits you.',
    cards: [
      {
        title: 'Receding hairline',
        text: 'A hairline moving back at the front or temples.',
        links: [
          { label: 'Neo Follicle (NFT)', href: child('neo-follicle-hair-transplant') },
          { label: 'FUE', href: child('fue-hair-transplant') },
          { label: 'DHI', href: child('dhi-hair-transplant') },
          { label: 'Temple', href: child('temple-hair-transplant') },
        ],
        cta: null,
      },
      {
        title: 'Thinning or crown loss',
        text: 'Thinning on top, at the crown or along the parting.',
        links: [
          { label: 'Crown', href: child('crown-hair-transplant') },
          { label: 'Female Hair Transplant', href: child('female-hair-transplant') },
          { label: 'PRP', href: child('prp-hair-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Facial hair',
        text: 'A patchy beard or moustache, or sparse eyebrows.',
        links: [
          { label: 'Beard & Moustache', href: child('beard-moustache-transplant') },
          { label: 'Eyebrow', href: child('eyebrow-hair-transplant') },
        ],
        cta: null,
      },
      {
        title: 'A previous transplant',
        text: 'Low growth, an unnatural hairline or a depleted donor area after earlier surgery.',
        links: [{ label: 'Failed Transplant Repair', href: child('failed-hair-transplant-repair') }],
        cta: null,
      },
      {
        title: 'Shedding or a scalp concern',
        text: 'More hair in the brush, or a scalp that needs checking before any treatment.',
        links: [
          { label: 'PRP', href: child('prp-hair-treatment') },
          { label: 'GFC', href: child('gfc-hair-treatment') },
          { label: 'Laser Therapy (LLLT)', href: child('low-level-laser-hair-therapy-lllt') },
          { label: 'AI Hair Analysis', href: '/technology/ai-integrated-hair-analysis/' },
        ],
        cta: null,
      },
      {
        title: 'Not sure yet',
        text: 'Book a consultation and start with an assessment of your hair, scalp and donor area.',
        links: [],
        cta: book,
      },
    ],
  },

  process: {
    eyebrow: 'Your Hair Assessment',
    h2: 'From First Consultation to Follow-Up',
    steps: [
      { title: 'Consultation', text: 'Your history, the pattern and pace of your hair loss, and what you would like to change.' },
      { title: 'Donor assessment', text: 'A review of donor density and quality, to judge how much can be used safely now and later.' },
      { title: 'Design', text: 'Where a transplant is suitable, the hairline and zones are planned to suit your face and how your hair may change.' },
      { title: 'Treatment options', text: 'The suitable techniques or non-surgical options, what each involves and their limits, before you decide.' },
      { title: 'Recovery and follow-up', text: 'Aftercare guidance and review appointments as your hair grows; results take time and vary from person to person.' },
    ],
    image: photo('fue-hair-transplant-in-bangalore-2'),
  },

  doctors: {
    eyebrow: 'Your Doctor',
    h2: 'Led by Dr Sandeep Mahapatra',
    cards: [
      sandeepCard(
        [
          'His approach focuses on diagnosis, donor conservation, natural hairline design, personalised treatment planning and long-term hair-restoration strategy.',
        ],
        ['Hair Transplant Surgeon', 'Founder, NeoSculpt6'],
        'Meet the Hair Restoration Expert',
      ),
    ],
  },

  technology: {
    h2: 'Technology in Hair Restoration',
    subline: 'Technology supports the assessment and the procedure; the plan remains the doctor’s clinical judgment.',
    paths: ['/technology/ai-integrated-hair-analysis/', '/technology/ai-integrated-donor-assessment/', '/technology/artas-robotic-hair-transplant/'],
  },

  cost: {
    h2: 'Hair Restoration Cost and Consultation',
    intro:
      'There is no fixed price for hair restoration. Your cost is explained after an assessment, once the doctor knows what your plan involves.',
    factors: [
      { title: 'Assessment', text: 'The cause and extent of your hair loss, and whether a procedure is suitable now.' },
      { title: 'Technique', text: 'The method chosen for harvesting and implanting, or the non-surgical option.' },
      { title: 'Donor supply', text: 'How much donor hair is available and how much can be used safely.' },
      { title: 'Zones treated', text: 'Hairline, temples, crown, facial hair or more than one area.' },
      { title: 'Your plan', text: 'Whether one session is planned, more than one, or combined care with follow-up.' },
    ],
    ctas: [book, call, whatsapp],
  },

  // Real Google reviews word for word, from the shared pool (src/data/reviews.ts), chosen for this hub's treatments.
  reviews: {
    h2: 'Success Stories',
    items: reviewsForPath('/hair-transplant-restoration/'),
  },

  faqs: {
    eyebrow: 'Quick Answers',
    h2: 'Hair Restoration FAQs',
    items: [
      {
        q: 'How do I know which hair restoration option is right for me?',
        a: 'It depends on the cause of your hair loss, the areas affected, your donor hair and your goals. The doctor assesses these at your consultation and explains which options may suit you and why.',
      },
      {
        q: 'Am I a suitable candidate for a hair transplant?',
        a: 'Not everyone is. Suitability depends on a diagnosis of your hair loss, enough healthy donor hair and realistic expectations. Where a transplant is not the right step, the doctor explains other options.',
      },
      {
        q: 'How is the technique chosen?',
        a: 'NFT, FUE, DHI and other approaches are ways of harvesting and implanting grafts. The technique is chosen for your hair, scalp and donor area after an assessment, not by name.',
      },
      {
        q: 'Are there non-surgical options?',
        a: 'For some forms of thinning and shedding, options such as PRP, GFC or laser therapy may be discussed. Whether they suit you, and what they can and cannot do, is explained after a hair and scalp assessment.',
      },
      {
        q: 'Can a previous hair transplant be corrected?',
        a: 'Some can. Repair depends on what went wrong, the donor hair that remains and the condition of the scalp, so it starts with a detailed assessment.',
      },
      {
        q: 'How much does hair restoration cost?',
        a: 'Cost depends on your assessment, the technique, your donor supply, the zones treated and your plan, so it is explained after your consultation rather than quoted in advance.',
      },
    ],
    cta: book,
  },
  faqsApproved: false,

  closing: {
    kicker: 'Start with an assessment',
    h2: 'Book Your Hair Restoration Consultation',
    paragraph:
      'Meet the doctor, have your hair, scalp and donor area assessed, and leave with a clear explanation of your options at NeoSculpt6, Whitefield, Bangalore.',
    chips: [],
    ctas: [book, call],
    image: reception,
  },

  pending: [
    ...sharedPending,
    'doctor: only "Hair Transplant Surgeon" and "Founder, NeoSculpt6" shown; years, transplant counts and degrees are † (about.ts)',
    'doctor: portrait is the old-site placeholder (services/index.ts)',
    'ARTAS robotic is listed under "DHI, FUE, NFT & Robotic Options" and links to its technology page (no service page)',
  ],
}
