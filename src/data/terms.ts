// Terms of Use page (/terms-of-use/). Draft written 2026-10-31 from the Neo Group sister-site terms
// (neofollicletransplant.com and dermasolutions.co.in share one LLP template; neofertility.co.in has a plain rewrite),
// rewritten for what this site does and with the sections a cosmetic clinic needs (results, prices, consent,
// emergencies). The sisters' payment-gateway and refund clause is left out: this site takes no payments.
// Before launch: the client confirms the LLP runs NeoSculpt6 and that there are no online payments, a lawyer reviews
// the text (including the rules on before-and-after photos and testimonials), and the dates are set.
// Contact details come from `clinic` in site.ts, so they stay in step with the footer and the privacy policy.

import { clinic, SITE_URL } from './site'
import { p, ul, type LegalDoc, type Section } from './legal'

const a = clinic.address
const postal = `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`
const email = { text: clinic.email, href: `mailto:${clinic.email}` }
const phone = { text: clinic.phone, href: clinic.phoneHref }
const domain = SITE_URL.replace('https://', '')
const privacyLink = { text: 'Privacy Policy', href: '/privacy-policy/' }

const sections: (Section | false)[] = [
  {
    id: 'about-these-terms',
    heading: 'About These Terms',
    blocks: [
      p(
        `NeoSculpt6 is run by ${clinic.legalEntity}, part of Neo Group. Our clinic is at ${postal}.`,
      ),
      p(
        'These terms cover your use of this website, ',
        { text: domain, href: '/' },
        '. How we handle your personal information is explained in our ',
        privacyLink,
        '. Our sister clinics’ websites have their own terms.',
      ),
    ],
  },
  {
    id: 'medical-information',
    heading: 'Medical Information Only',
    blocks: [
      p(
        'The articles, treatment pages, videos and answers on this website are written and medically reviewed under the guidance of Dr Sandeep Mahapatra, MD Dermatology. They explain treatments in general, for patient education.',
      ),
      p(
        'They are not medical advice for you, and they do not replace a consultation. Do not start, stop or delay any treatment because of something you read here. Speak to a qualified doctor first.',
      ),
      p(
        'In a medical emergency, call 112 or go to the nearest hospital. Do not use the booking form or WhatsApp for emergencies.',
      ),
    ],
  },
  {
    id: 'booking-requests',
    heading: 'Booking Requests and Consultations',
    blocks: [
      ul(
        'The booking form sends your details to our clinic team, who will call you back. If you give an email address, we use it only to reply about your request. How we handle your details is set out in our Privacy Policy.',
        'A booking request is not a confirmed appointment. Your appointment is confirmed only when the clinic confirms it with you.',
        'Your preferred doctor, date and time depend on availability. We will offer the closest option if they are not free.',
        'Sending an enquiry does not make you our patient. A doctor-patient relationship begins only at your consultation.',
        'For a video consultation, the doctor decides whether your concern can be assessed by video. Some concerns need an in-person examination before any advice or treatment.',
      ),
    ],
  },
  {
    id: 'results',
    heading: 'Results, Photos and Reviews',
    blocks: [
      p(
        'Every person’s skin, hair and body are different, so results differ from person to person. No treatment result is guaranteed. Your doctor will explain the results you can realistically expect, and the risks, at your consultation.',
      ),
      ul(
        'Before-and-after photographs show real patients, shared with their written consent. They show that person’s result, not a promise of yours.',
        'Patient reviews are public Google reviews, quoted as written. Each one is one person’s experience.',
      ),
    ],
  },
  {
    id: 'prices',
    heading: 'Prices and Estimates',
    blocks: [
      p(
        'Any price or price range on this website is a guide only. Your cost depends on your assessment, your treatment plan and the number of sessions you need. You will get a quote after your consultation, before any treatment begins. Prices may change without notice.',
      ),
    ],
  },
  {
    id: 'fees-and-refunds',
    heading: 'Fees, Cancellations and Refunds',
    blocks: [
      // TODO: client to confirm that no fee or deposit is taken online. If that changes, add the payment and refund terms.
      p(
        'This website does not take payments. Consultation and treatment fees, any deposit, rescheduling and refunds are explained and agreed with you at the clinic before your treatment.',
      ),
    ],
  },
  {
    id: 'treatment-consent',
    heading: 'Treatment Consent',
    blocks: [
      p(
        'Before any procedure, your doctor will explain it to you and ask for your informed written consent at the clinic. These terms do not replace that consent.',
      ),
      p('We treat patients under 18 only with the consent of a parent or legal guardian.'),
    ],
  },
  // Shown only once the external AI analysis tool is live (clinic.aiAnalysisHref in site.ts).
  !!clinic.aiAnalysisHref && {
    id: 'ai-analysis',
    heading: 'AI Analysis Tool',
    blocks: [
      p(
        'Our AI analysis tool gives an automated, general reading based on the photos and answers you provide. It is not a diagnosis. Please confirm any result with a doctor at a consultation before making treatment decisions.',
      ),
    ],
  },
  {
    id: 'using-this-website',
    heading: 'Using This Website Fairly',
    blocks: [
      p('Please use this website only for lawful purposes. You must not:'),
      ul(
        'Copy, change or republish content from this website without our permission',
        'Send harmful, threatening, unlawful or misleading material',
        'Try to get unauthorised access to the website or the systems behind it',
        'Make an enquiry or booking in someone else’s name without their permission',
      ),
      p(
        'We may block access to anyone who misuses the website. If your misuse of the website causes a claim or loss, you agree to cover it.',
      ),
    ],
  },
  {
    id: 'our-content',
    heading: 'Our Content and Trademarks',
    blocks: [
      p(
        `The NeoSculpt6 name and logo, and the text, photographs, videos and graphics on this website, belong to ${clinic.legalEntity} or the people who licensed them to us, and are protected by intellectual property law.`,
      ),
      p('Patient photographs must never be copied, saved or shared, for any purpose.'),
    ],
  },
  {
    id: 'third-parties',
    heading: 'Links and Third-Party Services',
    blocks: [
      p(
        'This website links to, and includes content from, other websites and services, such as our sister clinics, WhatsApp, Google Maps, YouTube and media coverage. Their own terms and privacy policies apply when you use them, and we are not responsible for their content.',
      ),
    ],
  },
  {
    id: 'accuracy',
    heading: 'Accuracy and Availability',
    blocks: [
      p(
        'We work to keep the information on this website accurate and up to date, including treatments, doctors and timings, but it can change. Please confirm details with the clinic before making decisions. We cannot promise the website will always be available or free of errors.',
      ),
    ],
  },
  {
    id: 'liability',
    heading: 'Limitation of Liability',
    blocks: [
      p(
        'As far as the law allows, we are not liable for any loss or damage that comes from relying on this website, from not being able to use it, or from decisions made without a consultation with a doctor.',
      ),
      p('Nothing in these terms limits any rights you have under Indian law, including the Consumer Protection Act, 2019.'),
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to These Terms',
    blocks: [
      p(
        'We may update these terms from time to time. The latest version is always on this page, with its date at the top. Using the website after a change means you accept the updated terms.',
      ),
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    blocks: [
      p('These terms are governed by the laws of India. Any dispute will be handled by the courts in Bengaluru, Karnataka.'),
    ],
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    blocks: [
      p('If you have a question about these terms, contact us:'),
      {
        type: 'contact',
        rows: [
          ['Email', [email]],
          ['Phone', [phone]],
          ['Address', [`${clinic.legalEntity} (NeoSculpt6), ${postal}`]],
        ],
      },
      p(
        'For concerns about your personal data, contact our ',
        { text: 'Grievance Officer', href: '/privacy-policy/#grievance-officer' },
        '.',
      ),
    ],
  },
]

export const terms: LegalDoc = {
  /** ISO dates. TODO: set the effective date at launch. */
  effectiveDate: '2026-10-31',
  updatedDate: '2026-10-31',
  intro: [
    `These terms apply when you use ${domain}, run by ${clinic.legalEntity} (“NeoSculpt6”, “we”, “us”). By using this website, you agree to them. Please also read our `,
    privacyLink,
    '.',
  ],
  summaryHeading: 'In Short',
  summary: [
    'This website explains treatments in general. It is not medical advice for you.',
    'Sending a booking request does not make you our patient. That starts at your consultation.',
    'Results differ from person to person. Photos and reviews show other people’s experiences, not a promise.',
    'Prices on this website are guides. Your quote comes after your doctor assesses you.',
    'Indian law applies, and disputes go to the courts in Bengaluru.',
  ],
  sections: sections.filter((s): s is Section => Boolean(s)),
}
