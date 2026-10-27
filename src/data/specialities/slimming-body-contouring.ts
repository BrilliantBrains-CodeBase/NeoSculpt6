// /slimming-body-contouring/: the Slimming & Body Contouring hub
// (brief: content/service/prompts/speciality-slimming-body-contouring.md).
//
// DRAFT COPY, as on the hair hub: the hub's own words are drafts for sign-off. Medical weight management,
// non-surgical contouring and surgery are kept apart. No target weight, inch loss, dose, speed or lasting result is
// promised; medicines, pregnancy, eating concerns and other health conditions are mentioned only as reasons for an
// assessment.
//
// Groups: all 26 pages service-page.md lists under Slimming & Body Contouring. The source has no surgical page in
// this section, so "Liposuction & Surgical Contouring" cross-links the Cosmetic Surgery pages that cover it.
//
// Doctors: Dr Sandeep for the weight-management and contouring pages; Dr Saranya T for the post-pregnancy and
// post-weight-loss pages (and the surgery the cross-links lead to). Paragraphs are the child pages' own wording.

import { reception } from '../services/index.ts'
import type { HubSource } from './types.ts'
import { book, call, hubOrder, pendingReviews, photo as hubPhoto, pillarPhoto, sandeepCard, saranyaCard, sharedPending, whatsapp } from './shared.ts'

const HUB = '/slimming-body-contouring/'
const child = (slug: string) => `${HUB}${slug}-in-bangalore/`
const surgery = (slug: string) => `/cosmetic-surgery/${slug}-in-bangalore/`
const photo = (file: string) => hubPhoto('slimming-body-contouring', file)

export const slimming: HubSource = {
  path: HUB,
  order: hubOrder(),

  hero: {
    eyebrow: 'Weight, Shape & Skin',
    intro:
      'Doctor-supervised weight management, non-surgical body contouring and surgical planning in Whitefield, Bangalore. Every plan starts with a medical assessment, so the approach fits your health and goals.',
    ctas: [book, call],
    image: pillarPhoto(HUB),
  },

  intro: {
    h2: 'Three Different Kinds of Care, One Assessment',
    paragraphs: [
      'Overall weight, localised fat and loose skin are different concerns and need different care. Medical weight management looks at health, habits and, where suitable, prescription medicines under supervision. Non-surgical contouring treats selected areas in people near a stable weight. Surgery is considered when skin or tissue change is beyond what other care can do.',
      'Your consultation starts with your health history, medicines, past efforts and goals. Weight, pregnancy, eating concerns and other health conditions all affect what is suitable, so no treatment is chosen before that assessment.',
    ],
    points: [
      { title: 'Medical assessment first', text: 'History, examination and, where useful, body-composition analysis before any plan.' },
      { title: 'Weight management', text: 'Doctor-supervised programmes; prescription medicines only where clinically suitable.' },
      { title: 'Non-surgical contouring', text: 'For selected areas of localised fat, cellulite or skin laxity, not overall weight.' },
      { title: 'Surgical planning', text: 'Liposuction or skin-removal surgery assessed by a plastic surgeon when appropriate.' },
      { title: 'Follow-up', text: 'Progress is reviewed over time; change is gradual and differs from person to person.' },
    ],
  },

  treatments: {
    h2: 'Slimming & Body Contouring Treatments',
    subline: 'Explore each treatment, or book a consultation and let the assessment point you to the right one.',
    groups: [
      {
        title: 'Doctor-Supervised Weight Management & GLP-1',
        text: 'Medical support for overall weight, starting with your health rather than a medicine.',
        image: photo('medical-weight-loss-treatment-in-bangalore-1'),
        paths: [
          child('glp-1-weight-loss-program'),
          child('mounjaro-weight-loss-consultation'),
          child('ozempic-weight-loss-consultation'),
          child('medical-weight-loss-treatment'),
          child('obesity-treatment'),
          child('personalized-diet-lifestyle-management'),
          child('body-composition-analysis'),
        ],
      },
      {
        title: 'Fat Reduction & Non-Surgical Contouring',
        text: 'For selected areas of localised fat in people near a stable weight.',
        image: photo('body-contouring-in-bangalore-3'),
        paths: [
          child('body-contouring'),
          child('cryolipolysis-treatment'),
          child('lipolaser-treatment'),
          child('lipozero-treatment'),
          child('inch-loss-treatment'),
          child('belly-tummy-fat-reduction'),
          child('arm-fat-reduction'),
          child('thigh-fat-reduction'),
          child('hip-fat-reduction'),
          child('love-handle-reduction'),
          child('upper-back-fat-reduction'),
          child('double-chin-fat-reduction'),
        ],
      },
      {
        title: 'Liposuction & Surgical Contouring',
        text: 'Surgical options, planned by our plastic surgeon, on the Cosmetic Surgery pages.',
        image: photo('body-contouring-in-bangalore-4'),
        paths: [surgery('liposuction-surgery'), surgery('tummy-tuck-surgery-abdominoplasty'), surgery('mommy-makeover-surgery')],
      },
      {
        title: 'Post-Pregnancy & Post-Weight-Loss Planning',
        text: 'Planning for loose skin, residual fat and abdominal changes once weight is stable.',
        image: photo('post-pregnancy-belly-correction-in-bangalore-1'),
        paths: [
          child('post-pregnancy-belly-correction'),
          child('post-weight-loss-body-planning'),
          child('post-weight-loss-loose-skin-treatment'),
        ],
      },
      {
        title: 'Stretch Marks, Cellulite & Skin Quality',
        text: 'Texture and laxity concerns that are separate from fat or weight.',
        image: photo('cellulite-reduction-in-bangalore-1'),
        paths: [
          child('stretch-mark-treatment'),
          child('skin-tightening-treatment'),
          child('cellulite-reduction'),
          child('anti-cellulite-therapy'),
        ],
      },
    ],
  },

  concerns: {
    h2: 'Choose Your Starting Point',
    subline: 'Start with the concern closest to yours. Your consultation confirms which option, if any, suits you.',
    cards: [
      {
        title: 'Overall weight',
        text: 'Weight that affects your health or daily life, and support to manage it.',
        links: [
          { label: 'Medical Weight Loss', href: child('medical-weight-loss-treatment') },
          { label: 'GLP-1 Programme', href: child('glp-1-weight-loss-program') },
          { label: 'Diet & Lifestyle', href: child('personalized-diet-lifestyle-management') },
        ],
        cta: null,
      },
      {
        title: 'Localised fat',
        text: 'A specific area that stays the same despite a stable weight.',
        links: [
          { label: 'Body Contouring', href: child('body-contouring') },
          { label: 'Cryolipolysis', href: child('cryolipolysis-treatment') },
          { label: 'Liposuction', href: surgery('liposuction-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Loose skin',
        text: 'Skin that has not tightened after weight change or with age.',
        links: [
          { label: 'Skin Tightening', href: child('skin-tightening-treatment') },
          { label: 'Post-Weight-Loss Loose Skin', href: child('post-weight-loss-loose-skin-treatment') },
        ],
        cta: null,
      },
      {
        title: 'Changes after pregnancy',
        text: 'Abdominal fat, skin or muscle changes once you have recovered from pregnancy.',
        links: [
          { label: 'Post-Pregnancy Belly Correction', href: child('post-pregnancy-belly-correction') },
          { label: 'Tummy Tuck', href: surgery('tummy-tuck-surgery-abdominoplasty') },
        ],
        cta: null,
      },
      {
        title: 'Stretch marks or cellulite',
        text: 'Texture changes in the skin rather than fat.',
        links: [
          { label: 'Stretch Marks', href: child('stretch-mark-treatment') },
          { label: 'Cellulite Reduction', href: child('cellulite-reduction') },
        ],
        cta: null,
      },
      {
        title: 'Not sure yet',
        text: 'Book a consultation and start with a medical assessment of your health and goals.',
        links: [],
        cta: book,
      },
    ],
  },

  process: {
    eyebrow: 'Your Assessment',
    h2: 'From Health History to Follow-Up',
    steps: [
      { title: 'History', text: 'Your health, medicines, past weight-management efforts, pregnancies and any eating concerns.' },
      { title: 'Examination', text: 'The areas that concern you, skin quality and, where useful, body-composition analysis.' },
      { title: 'Goals', text: 'What you would like to change, and whether that is overall weight, a specific area or skin.' },
      { title: 'Suitability', text: 'Whether medical, non-surgical or surgical care suits you now, and when it does not.' },
      { title: 'Options', text: 'The suitable approaches, what each can and cannot change, and how they may combine.' },
      { title: 'Risks and recovery', text: 'Side effects, downtime and monitoring for the option you are considering.' },
      { title: 'Follow-up', text: 'Regular reviews of progress and safety; change is gradual and differs between people.' },
    ],
    image: photo('glp-1-weight-loss-program-in-bangalore-1'),
  },

  doctors: {
    eyebrow: 'Your Doctors',
    h2: 'Medical and Surgical Care',
    cards: [
      sandeepCard([
        'Consultations separate localised fat, skin laxity or texture concerns from broader weight-management needs before a treatment is discussed. Change is described as gradual and individual, with follow-up used to review response before any further treatment.',
      ]),
      saranyaCard([
        'Her consultation looks at weight stability, skin excess, contour concerns, previous procedures and recovery priorities before discussing whether non-surgical care, surgical evaluation or a staged plan is more appropriate.',
      ]),
    ],
  },

  technology: {
    h2: 'Technology & Infrastructure',
    subline: 'Devices and medicines are used only after a clinical assessment of suitability; they are not right for everyone.',
    paths: [
      '/technology/body-contouring-cryolipolysis-platforms/',
      '/technology/vaser-liposuction-technology/',
      '/technology/reaction-viora-rf-tightening/',
    ],
  },

  cost: {
    h2: 'Slimming & Body Contouring Cost and Consultation',
    intro: 'There is no fixed price. Your cost is explained after a medical assessment, once the doctor knows what your plan involves.',
    factors: [
      { title: 'Assessment', text: 'Your health, goals and which kind of care is suitable.' },
      { title: 'Approach', text: 'Medical supervision, a non-surgical device, surgery, or a combination.' },
      { title: 'Areas treated', text: 'How many areas, and their size.' },
      { title: 'Sessions or duration', text: 'How many sessions, or how long a programme runs, if suitable.' },
      { title: 'Monitoring and follow-up', text: 'Reviews, tests and aftercare your plan needs.' },
    ],
    ctas: [book, call, whatsapp],
  },

  reviews: { h2: 'Success Stories', items: pendingReviews('Slimming & Body Contouring', ['Weight Management', 'Body Contouring', 'Dr Sandeep Mahapatra by name']) },

  faqs: {
    eyebrow: 'Quick Answers',
    h2: 'Slimming & Body Contouring FAQs',
    items: [
      {
        q: 'Is body contouring a weight-loss treatment?',
        a: 'No. Body contouring treats selected areas of localised fat or skin in people near a stable weight. Overall weight is managed medically, and the consultation explains which kind of care suits your concern.',
      },
      {
        q: 'Can I get GLP-1 medicines such as Mounjaro or Ozempic here?',
        a: 'These are prescription medicines. Whether one is suitable is a medical decision made after reviewing your health, other medicines and history, with monitoring and follow-up. They are not suitable for everyone.',
      },
      {
        q: 'How much change can I expect?',
        a: 'Change varies with the treatment, your body and your habits, so no fixed amount of weight or inches is promised. Your doctor explains realistic expectations for the option you are considering.',
      },
      {
        q: 'When is surgery considered instead?',
        a: 'Surgery may be discussed when loose skin, abdominal-wall changes or larger areas of fat are beyond what non-surgical care can address, and once weight is stable. A plastic surgeon assesses suitability.',
      },
      {
        q: 'Can I start treatment after pregnancy?',
        a: 'Timing depends on your recovery, whether you are breastfeeding and how stable your weight is. The consultation helps decide when an assessment or treatment is appropriate.',
      },
      {
        q: 'How much does treatment cost?',
        a: 'Cost depends on your assessment, the approach, the areas treated, the number of sessions or programme length, and follow-up, so it is explained after your consultation rather than quoted in advance.',
      },
    ],
    cta: book,
  },
  faqsApproved: false,

  closing: {
    kicker: 'Start with an assessment',
    h2: 'Book Your Body Contouring Consultation',
    paragraph: 'Meet the doctor, talk through your health and goals, and leave with a clear explanation of the options that may suit you at NeoSculpt6, Whitefield, Bangalore.',
    chips: [],
    ctas: [book, call],
    image: reception,
  },

  pending: [
    ...sharedPending,
    'medical sign-off: the GLP-1, Mounjaro and Ozempic wording (prescription medicines, suitability, monitoring) needs a doctor’s review',
    '"Liposuction & Surgical Contouring" links the Cosmetic Surgery pages (no slimming page covers surgery)',
    'doctors: Dr Saranya T has no portrait; Dr Sandeep’s is the old-site placeholder',
  ],
}
