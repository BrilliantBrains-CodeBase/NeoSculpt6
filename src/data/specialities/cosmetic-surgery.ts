// /cosmetic-surgery/: the Cosmetic Surgery hub (brief: content/service/prompts/speciality-cosmetic-surgery.md).
//
// DRAFT COPY, as on the hair hub (see hair-transplant-restoration.ts): the hub's own words are drafts for sign-off,
// kept to what the child pages say. Cosmetic and reconstructive care are described separately. No "scarless",
// "painless" or outcome promises; scars and recovery are described as the child pages do.
//
// Groups: every page service-page.md lists under Cosmetic Surgery (23, including the two from
// Blepharoplasty-and-Chin-Augmentation.md). The vitiligo pages sit in this section of the source, so they form the
// brief's "other specialist surgical pathway" group.
//
// Doctors: Dr Saranya T leads the surgical pages; Dr Sandeep is the vitiligo pages' doctor. Dr Lavanyaa M (named on
// the blepharoplasty and chin pages) is left off until her credentials and profile are signed off. Each card's
// paragraph is the child pages' own wording about the doctor's approach, without figures.

import { reception } from '../services/index.ts'
import type { HubSource } from './types.ts'
import { book, call, hubOrder, pendingReviews, photo as hubPhoto, pillarPhoto, sandeepCard, saranyaCard, sharedPending, whatsapp } from './shared.ts'

const HUB = '/cosmetic-surgery/'
const child = (slug: string) => `${HUB}${slug}-in-bangalore/`
const photo = (file: string) => hubPhoto('cosmetic-surgery', file)

export const cosmeticSurgery: HubSource = {
  path: HUB,
  order: hubOrder(),

  hero: {
    eyebrow: 'Face, Breast, Body & Reconstruction',
    intro:
      'Cosmetic and reconstructive surgery in Whitefield, Bangalore, planned around your anatomy, safety and recovery. Every plan starts with a consultation and examination, and surgery is only discussed once it suits you.',
    ctas: [book, call],
    image: pillarPhoto(HUB),
  },

  intro: {
    h2: 'Surgery Planned Around Anatomy, Safety and Recovery',
    paragraphs: [
      'Cosmetic surgery changes the shape or proportion of the face, breasts or body because you want it to. Reconstructive surgery restores form or function after injury, burns, illness or earlier surgery. Both start the same way at NeoSculpt6: a doctor-led consultation and examination before any procedure is planned.',
      'Suitability, the technique, scars and recovery differ from person to person. Your consultation explains the options, their limits and risks, and what recovery involves, so you can decide with clear information.',
    ],
    points: [
      { title: 'Doctor-led assessment', text: 'Your concern, health and anatomy are examined by the surgeon who plans your care.' },
      { title: 'Face and facial profile', text: 'Nose, eyelids, chin, jawline and facial ageing, planned for balance rather than a template.' },
      { title: 'Breast and body', text: 'Breast, abdomen and body-contour surgery, with scars and recovery explained before you decide.' },
      { title: 'Reconstruction and repair', text: 'Trauma, burns, scars and earlier surgery, where function and comfort may matter as much as appearance.' },
      { title: 'Suitability first', text: 'Where surgery is not the right step, or not yet, you are told why and what else may help.' },
    ],
  },

  treatments: {
    h2: 'Cosmetic & Reconstructive Surgery',
    subline: 'Explore each procedure, or book a consultation and let the examination point you to the right one.',
    groups: [
      {
        title: 'Face & Facial Profile',
        text: 'Procedures for the nose, eyelids, chin, cheeks, ears and facial ageing.',
        image: photo('rhinoplasty-in-bangalore-1'),
        paths: [
          child('rhinoplasty'),
          child('facelift-surgery'),
          child('blepharoplasty-eyelid-surgery'),
          child('chin-augmentation-surgery'),
          child('dimple-creation-surgery'),
          child('ear-lobe-repair-surgery'),
          child('xanthelasma-removal-treatment'),
        ],
      },
      {
        title: 'Breast',
        text: 'Breast size, shape and position, and male chest concerns.',
        image: photo('breast-lift-surgery-mastopexy-in-bangalore-1'),
        paths: [
          child('breast-augmentation-surgery'),
          child('breast-lift-surgery-mastopexy'),
          child('breast-reduction-surgery'),
          child('gynecomastia-surgery'),
        ],
      },
      {
        title: 'Body Contouring Surgery',
        text: 'Surgery for localised fat, loose abdominal skin and changes after pregnancy.',
        image: photo('tummy-tuck-surgery-abdominoplasty-in-bangalore-1'),
        paths: [child('liposuction-surgery'), child('tummy-tuck-surgery-abdominoplasty'), child('mommy-makeover-surgery')],
      },
      {
        title: 'Reconstructive, Trauma, Scar & Burn Repair',
        text: 'Restoring form and function after injury, burns, illness or earlier surgery.',
        image: photo('scar-revision-surgery-in-bangalore-1'),
        paths: [
          child('advanced-trauma-reconstruction'),
          child('burn-scar-reconstruction-surgery'),
          child('head-neck-reconstruction-surgery'),
          child('scar-revision-surgery'),
          child('post-surgical-correction-surgery'),
        ],
      },
      {
        title: 'Vitiligo Surgery & Pigment Care',
        text: 'Surgical and light-based options for stable vitiligo, after a dermatology assessment.',
        image: photo('vitiligo-treatment-in-bangalore-1'),
        paths: [
          child('melanocyte-transfer-surgery'),
          child('ncecs-treatment'),
          child('phototherapy-for-vitiligo'),
          child('vitiligo-treatment'),
        ],
      },
    ],
  },

  concerns: {
    h2: 'Choose Your Starting Point',
    subline: 'Start with the concern closest to yours. Your consultation confirms which option, if any, suits you.',
    cards: [
      {
        title: 'Facial balance',
        text: 'The shape of the nose, chin or profile.',
        links: [
          { label: 'Rhinoplasty', href: child('rhinoplasty') },
          { label: 'Chin Augmentation', href: child('chin-augmentation-surgery') },
          { label: 'Dimple Creation', href: child('dimple-creation-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Facial ageing',
        text: 'Heavy eyelids, jowls or a looser jawline and neck.',
        links: [
          { label: 'Facelift', href: child('facelift-surgery') },
          { label: 'Blepharoplasty', href: child('blepharoplasty-eyelid-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Breast or chest',
        text: 'Breast size, shape or position, or enlarged male breast tissue.',
        links: [
          { label: 'Augmentation', href: child('breast-augmentation-surgery') },
          { label: 'Breast Lift', href: child('breast-lift-surgery-mastopexy') },
          { label: 'Reduction', href: child('breast-reduction-surgery') },
          { label: 'Gynecomastia', href: child('gynecomastia-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Body shape after pregnancy or weight change',
        text: 'Loose abdominal skin, stubborn fat or changes after pregnancy.',
        links: [
          { label: 'Tummy Tuck', href: child('tummy-tuck-surgery-abdominoplasty') },
          { label: 'Liposuction', href: child('liposuction-surgery') },
          { label: 'Mommy Makeover', href: child('mommy-makeover-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Scars or reconstruction',
        text: 'A scar, burn, injury or an earlier operation you would like assessed.',
        links: [
          { label: 'Scar Revision', href: child('scar-revision-surgery') },
          { label: 'Burn Scar Reconstruction', href: child('burn-scar-reconstruction-surgery') },
          { label: 'Post-Surgical Correction', href: child('post-surgical-correction-surgery') },
        ],
        cta: null,
      },
      {
        title: 'Not sure yet',
        text: 'Book a consultation and start with an examination and a conversation about your goals.',
        links: [],
        cta: book,
      },
    ],
  },

  process: {
    eyebrow: 'Your Surgical Journey',
    h2: 'From Consultation to Follow-Up',
    steps: [
      { title: 'Consultation and examination', text: 'Your concern, health, medicines and previous procedures, and an examination of the area.' },
      { title: 'Suitability', text: 'Whether surgery suits you now, and the alternatives, including not operating.' },
      { title: 'Procedure planning', text: 'The technique, likely scar placement, anaesthesia and the recovery your plan involves.' },
      { title: 'Consent', text: 'Risks, limits and aftercare explained in writing, with time for your questions before you decide.' },
      { title: 'Recovery', text: 'Aftercare guidance for wound care, activity and return to work, matched to your procedure.' },
      { title: 'Follow-up', text: 'Review appointments while you heal; results settle over time and vary from person to person.' },
    ],
    image: photo('mommy-makeover-surgery-in-bangalore-1'),
  },

  doctors: {
    eyebrow: 'Your Doctors',
    h2: 'Led by Specialists',
    cards: [
      saranyaCard([
        'Her approach centres on careful examination, proportionate planning, safety, realistic expectations about scars and contour, and practical recovery guidance rather than a standard package.',
      ]),
      sandeepCard([
        'For vitiligo, treatment is considered only after a consultation covering stability, the treatment area, previous management and expectations. Repigmentation develops gradually and varies by body site and person.',
      ]),
    ],
  },

  technology: {
    h2: 'Technology & Infrastructure',
    subline: 'Technology supports planning and treatment; it does not replace diagnosis or the surgeon’s judgment.',
    paths: ['/technology/vaser-liposuction-technology/', '/technology/excimer-laser-targeted-phototherapy/'],
  },

  cost: {
    h2: 'Cosmetic Surgery Cost and Consultation',
    intro: 'There is no fixed price for surgery. Your cost is explained after a consultation and examination, once your plan is clear.',
    factors: [
      { title: 'Assessment', text: 'Your concern, health and whether surgery is suitable now.' },
      { title: 'Procedure', text: 'The operation planned, or more than one combined.' },
      { title: 'Technique and anaesthesia', text: 'The surgical approach and the anaesthesia it needs.' },
      { title: 'Hospital stay', text: 'Whether a stay is needed, and for how long.' },
      { title: 'Recovery and follow-up', text: 'Garments, dressings and review appointments after surgery.' },
    ],
    ctas: [book, call, whatsapp],
  },

  reviews: { h2: 'Success Stories', items: pendingReviews('Cosmetic Surgery', ['Cosmetic Surgery', 'Reconstructive Surgery', 'Dr Saranya T by name']) },

  faqs: {
    eyebrow: 'Quick Answers',
    h2: 'Cosmetic Surgery FAQs',
    items: [
      {
        q: 'What is the difference between cosmetic and reconstructive surgery?',
        a: 'Cosmetic surgery changes appearance by choice, such as the shape of the nose or breasts. Reconstructive surgery restores form or function after injury, burns, illness or earlier surgery. Your consultation clarifies which applies to your concern.',
      },
      {
        q: 'How do I know if I am a suitable candidate?',
        a: 'Suitability depends on your health, anatomy, goals and how stable your weight or condition is. The surgeon examines you and explains whether surgery suits you, and what the alternatives are.',
      },
      {
        q: 'Will I have a scar?',
        a: 'Most surgery leaves a scar. Where it sits, how it is planned and how it matures are discussed at your consultation, along with aftercare that supports healing.',
      },
      {
        q: 'How long is recovery?',
        a: 'Recovery depends on the procedure, the extent of surgery and your health. Your plan sets out time off work, activity limits and follow-up before you decide.',
      },
      {
        q: 'Can earlier surgery or a scar be corrected?',
        a: 'Some can. Correction depends on the tissue, the scar and what went wrong, so it starts with a detailed examination.',
      },
      {
        q: 'How much does cosmetic surgery cost?',
        a: 'Cost depends on your assessment, the procedure, technique and anaesthesia, any hospital stay and follow-up, so it is explained after your consultation rather than quoted in advance.',
      },
    ],
    cta: book,
  },
  faqsApproved: false,

  closing: {
    kicker: 'Start with a consultation',
    h2: 'Book Your Cosmetic Surgery Consultation',
    paragraph: 'Meet the surgeon, have your concern examined, and leave with a clear explanation of your options, risks and recovery at NeoSculpt6, Whitefield, Bangalore.',
    chips: [],
    ctas: [book, call],
    image: reception,
  },

  pending: [
    ...sharedPending,
    'doctor: Dr Lavanyaa M (blepharoplasty, chin augmentation) is not shown until her credentials, portrait and profile page are signed off',
    'doctors: Dr Saranya T has no portrait; Dr Sandeep’s is the old-site placeholder',
    'vitiligo pages (Dr Sandeep) are grouped here because service-page.md lists them under Cosmetic Surgery; confirm they belong on this hub',
  ],
}
