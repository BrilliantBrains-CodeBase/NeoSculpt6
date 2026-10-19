// New pages that homepage.md links to but the old site never had. Meta here is a DRAFT for SEO sign-off;
// generate-pages.mjs marks every field below as `todo`. Keep this file to erasable TypeScript only.
// Words kept out on purpose (homepage.md): "best", "No. 1", "guaranteed", "permanent", "painless", "scarless".

export interface HubDraft {
  path: string
  type: 'hub' | 'doctor'
  name: string
  h1: string
  title: string
  description: string
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
    name: 'Our Technology',
    h1: 'Our Technology',
    title: 'Our Technology in Bangalore | NeoSculpt6',
    description:
      'AI hair and donor analysis, ARTAS robotic harvesting, Vaser, CO2 fractional and Q-Switch lasers at NeoSculpt6, Whitefield. Technology that supports the doctor.',
  },
  {
    path: '/dr-saranya-t/',
    type: 'doctor',
    name: 'Dr Saranya T',
    h1: 'Dr Saranya T',
    title: 'Dr Saranya T | Plastic & Reconstructive Surgeon | NeoSculpt6',
    description:
      'Meet Dr Saranya T, M.Ch Plastic & Reconstructive Surgeon at NeoSculpt6 in Whitefield, Bangalore, leading face, breast and body cosmetic surgery.',
  },
  {
    path: '/international-patients/',
    type: 'hub',
    name: 'International Patients',
    h1: 'International and NRI Patients',
    title: 'International & NRI Patients in Bangalore | NeoSculpt6',
    description:
      'Plan your treatment in Bangalore before you fly: video consultation, written plan and cost, travel support and follow-up from home with NeoSculpt6.',
  },
]
