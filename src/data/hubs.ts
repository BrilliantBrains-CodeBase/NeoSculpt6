// New pages the old site never had: pages homepage.md links to and new service pages from the service docs. Doctor
// profiles are not here: their routes and SEO come from src/data/doctors.json.
// Meta here is a DRAFT for SEO sign-off unless `source` names the doc it was copied from;
// generate-pages.mjs marks drafted fields as `todo`. Keep this file to erasable TypeScript only.
// Words kept out on purpose (homepage.md): "best", "No. 1", "guaranteed", "permanent", "painless", "scarless".

export interface HubDraft {
  path: string
  type: 'hub' | 'service'
  name: string
  h1: string
  title: string
  description: string
  /** The doc that gives this page's title, description and H1 word for word (not a draft). */
  source?: string
}

export const hubs: HubDraft[] = [
  {
    path: '/hair-transplant-restoration/',
    type: 'hub',
    name: 'Hair Transplant & Restoration',
    h1: 'Hair Transplant & Restoration in Bangalore',
    title: 'Hair Transplant & Restoration in Bangalore | NeoSculpt6',
    description:
      'Doctor-led hair transplant and restoration in Whitefield, Bangalore: NFT, FUE, DHI, PRP and GFC, planned by Dr Sandeep Mahapatra. Book a consultation.',
  },
  {
    path: '/cosmetic-surgery/',
    type: 'hub',
    name: 'Cosmetic Surgery',
    h1: 'Cosmetic Surgery in Bangalore',
    title: 'Cosmetic Surgery in Bangalore | NeoSculpt6',
    description:
      'Face, breast and body surgery in Whitefield, Bangalore, planned around anatomy, safety and recovery by Dr Saranya T, M.Ch Plastic Surgeon. Book a consultation.',
  },
  {
    path: '/slimming-body-contouring/',
    type: 'hub',
    name: 'Slimming & Body Contouring',
    h1: 'Slimming & Body Contouring in Bangalore',
    title: 'Slimming & Body Contouring in Bangalore | NeoSculpt6',
    description:
      'Surgical, non-surgical and medical body contouring in Whitefield, Bangalore, from Vaser liposuction and cryolipolysis to doctor-supervised GLP-1 programmes.',
  },
  {
    path: '/laser-skin-aesthetic/',
    type: 'hub',
    name: 'Laser & Skin Aesthetics',
    h1: 'Laser & Skin Aesthetics in Bangalore',
    title: 'Laser & Skin Aesthetics in Bangalore | NeoSculpt6',
    description:
      'Acne scars, pigmentation and unwanted hair treated by diagnosis and skin type in Whitefield, Bangalore, on CO2, Q-Switch and excimer platforms.',
  },
  {
    path: '/anti-aging-injectables/',
    type: 'hub',
    name: 'Anti-Ageing & Injectables',
    h1: 'Anti-Ageing & Injectables in Bangalore',
    title: 'Anti-Ageing & Injectables in Bangalore | NeoSculpt6',
    description:
      'Botox, dermal fillers, Profhilo and HIFU in Whitefield, Bangalore, planned and performed by Dr Sandeep Mahapatra for natural, age-appropriate results.',
  },
  {
    path: '/cosmetic-gynecology/',
    type: 'hub',
    name: 'Cosmetic Gynaecology',
    h1: 'Cosmetic Gynaecology in Bangalore',
    title: 'Cosmetic Gynaecology in Bangalore | NeoSculpt6',
    description:
      'Private, respectful care for intimate and post-pregnancy concerns in Whitefield, Bangalore, with a confidential one-to-one consultation.',
  },
  {
    path: '/technology/',
    type: 'hub',
    // The doc's breadcrumb ("Home › Technology › …"). Its title tag is the live one, kept as the doc says; the doc's
    // note suggests "Advanced Aesthetic Technology in Bangalore | NeoSculpt6" if SEO approves a change.
    name: 'Technology',
    h1: 'Technology',
    title: 'Technology - Neo Sculpt 6',
    description:
      'Technology-backed care at NeoSculpt6 supports diagnosis, planning, safety and treatment precision while remaining guided by clinical judgment.',
    source: 'content/technology/technology-international-patient.md',
  },
  {
    // New page (not on the live site). URL, title, H1 and description: content/service/Blepharoplasty-and-Chin-
    // Augmentation.md, "SEO (new page)".
    path: '/cosmetic-surgery/chin-augmentation-surgery-in-bangalore/',
    type: 'service',
    name: 'Chin Augmentation Surgery',
    h1: 'Chin Augmentation Surgery in Bangalore for a Balanced Facial Profile',
    title: 'Chin Augmentation Surgery in Bangalore - Neo Sculpt 6',
    description:
      'Chin augmentation surgery in Bangalore at NeoSculpt6: chin implant or sliding genioplasty to improve a weak or recessed chin and facial profile. Book a consultation.',
    source: 'content/service/Blepharoplasty-and-Chin-Augmentation.md',
  },
  {
    path: '/international-patients/',
    type: 'hub',
    name: 'International Patients',
    h1: 'International Patient Care in Bangalore',
    title: 'International Patient Care in Bangalore | NeoSculpt6',
    description:
      'Plan your NeoSculpt6 treatment journey to Bangalore with virtual consultation, personalised care planning, in-person assessment guidance and treatment-specific follow-up support.',
    source: 'content/technology/technology-international-patient.md',
  },
  {
    path: '/results/',
    type: 'hub',
    name: 'Results',
    h1: 'Before & After Results',
    title: 'Before & After Results | NeoSculpt6',
    description:
      'Consented before-and-after cases from NeoSculpt6, Whitefield, Bangalore: hair restoration, body contouring, skin, anti-ageing and cosmetic surgery.',
  },
]
