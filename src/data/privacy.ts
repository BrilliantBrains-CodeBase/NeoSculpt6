// Privacy Policy page (/privacy-policy/). Draft written 2026-10-31 from the Neo Group sister-site policies
// (dermasolutions.co.in, neofollicletransplant.com, neofertility.co.in), rewritten to describe what this site does.
// Before launch: the client confirms the LLP below runs NeoSculpt6, a lawyer reviews the text, and the dates are set.
// If analytics or an ad pixel (GA, Meta Pixel) is ever added, update "Cookies" and "Third-party services" and add a
// consent banner first. Contact details come from `clinic` in site.ts, so they stay in step with the footer.

import { clinic, SITE_URL } from './site'
import { p, ul, type LegalDoc, type Section } from './legal'

export type { Block, Inline, Section } from './legal'

const a = clinic.address
const postal = `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`
const email = { text: clinic.email, href: `mailto:${clinic.email}` }
const phone = { text: clinic.phone, href: clinic.phoneHref }
const google = 'https://policies.google.com/privacy'

export const privacy: LegalDoc = {
  /** ISO dates. TODO: set the effective date at launch. */
  effectiveDate: '2026-10-31',
  updatedDate: '2026-10-31',
  intro: [
    `This policy explains how ${clinic.legalEntity} (“NeoSculpt6”, “we”, “us”) collects, uses and protects the personal and medical information you share with us.`,
  ],
  summaryHeading: 'In Short',
  summary: [
    'We collect only what we need to book your visit, treat you and keep your medical record.',
    'When you send the booking form, your details go to our clinic team’s private Google Sheet and email inbox, and nowhere else.',
    'Your photographs and medical records are never shared or published without your written consent.',
    'We do not sell your personal data.',
    `To see, correct or delete your data, email ${clinic.email}.`,
  ],
  sections: [
    {
      id: 'who-we-are',
      heading: 'Who We Are',
      blocks: [
        p(
          `NeoSculpt6 is run by ${clinic.legalEntity}, part of Neo Group. Our clinic is at ${postal}.`,
        ),
        p('This policy covers our website ', { text: SITE_URL.replace('https://', ''), href: '/' }, ', and the information you give us by phone, WhatsApp, email or at the clinic. The same LLP runs our sister clinics and their websites:'),
        ul(...clinic.sisterClinics.map((s) => ({ text: s.name, href: s.href }))),
      ],
    },
    {
      id: 'laws',
      heading: 'The Laws We Follow',
      blocks: [
        p('We publish this policy under, and handle your information in line with:'),
        ul(
          'Section 43A of the Information Technology Act, 2000',
          'The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011',
          'The Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021',
          'The Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025, as their provisions come into force',
        ),
      ],
    },
    {
      id: 'what-we-collect',
      heading: 'What We Collect',
      blocks: [
        ul(
          'Booking form: your name, phone number, email address (if you give one), the treatment you are interested in, preferred doctor, preferred date and time, and whether you want an in-clinic or video consultation.',
          'With a booking request, the website also sends the page you sent it from, the first page of your visit, the website that linked you to us, and any advertising tags in that first link (such as utm_source or gclid). This tells us which page or advert helped you find us.',
          'Messages, photos and documents you send us by WhatsApp, phone or email.',
          'At the clinic: your medical history, consultation notes, prescriptions, test reports, consent forms and clinical photographs. The law treats these as sensitive personal data, and we handle them with extra care.',
          'Basic technical data (such as your IP address and browser type) that the third-party services listed below receive when their content loads.',
        ),
        p('Please share only what is needed for your enquiry. Do not send medical records through the website.'),
      ],
    },
    {
      id: 'booking-form',
      heading: 'How the Booking Form Works',
      blocks: [
        p(
          'When you press “Request My Consultation”, your details are sent securely to a private Google Sheet that only our clinic team can open, and to our clinic email inbox, so we can call you back. If you give an email address, we use it only to reply about your request. We do not add you to any mailing list.',
        ),
        p(
          'Google stores the Sheet and the emails for us, under ',
          { text: 'Google’s privacy policy', href: google },
          '. If sending fails, the form offers to open WhatsApp with your details filled in instead. Nothing goes through WhatsApp unless you choose to send that message.',
        ),
      ],
    },
    {
      id: 'why-we-use-it',
      heading: 'Why We Use Your Information',
      blocks: [
        ul(
          'To reply to your enquiry and book, confirm or remind you of appointments',
          'To consult, diagnose, plan and carry out your treatment, and to follow up afterwards',
          'To keep the medical records the law requires',
          'To send clinic updates or offers, only if you agree. You can stop them at any time.',
          'To meet our legal and regulatory duties',
        ),
      ],
    },
    {
      id: 'photographs',
      heading: 'Clinical Photographs and Sensitive Treatments',
      blocks: [
        p('Before-and-after photographs are part of good aesthetic care. We take them for your medical record and to track your progress.'),
        ul(
          'We never use your photographs on our website, social media or in advertising without your separate written consent.',
          'When you do agree, we hide your face and other identifying features unless you tell us otherwise.',
          'You can withdraw your consent for future use at any time.',
          'Intimate and cosmetic gynaecology care is handled with extra confidentiality, by the treating team only.',
        ),
      ],
    },
    {
      id: 'sharing',
      heading: 'Who We Share It With',
      blocks: [
        p('We share your information only when we need to, and only as much as needed:'),
        ul(
          'Our doctors and clinical staff who are involved in your care',
          'Neo Group sister clinics, when needed for your care, for example a referral',
          'Laboratories and specialists we refer you to',
          'Service providers who help us run the clinic (such as hosting, messaging and email), who must keep it confidential',
          'Government or legal authorities, when the law requires it',
        ),
        p('We do not sell your personal data.'),
      ],
    },
    {
      id: 'third-parties',
      heading: 'Third-Party Services on This Website',
      blocks: [
        p('Some features of this website come from other companies. Each follows its own privacy policy:'),
        {
          type: 'table',
          head: ['Service', 'Where it is used', 'Privacy policy'],
          rows: [
            ['Google Workspace (Sheets and Gmail)', 'Stores booking requests and sends our booking emails', [{ text: 'Google privacy policy', href: google }]],
            ['WhatsApp (Meta)', 'WhatsApp buttons, and the booking form’s fallback if sending fails', [{ text: 'WhatsApp privacy policy', href: 'https://www.whatsapp.com/legal/privacy-policy' }]],
            ['Google Maps', 'The map on our contact page', [{ text: 'Google privacy policy', href: google }]],
            ['YouTube', 'Treatment videos, in privacy-enhanced mode. A video loads only when you press play.', [{ text: 'Google privacy policy', href: google }]],
            ['Google Fonts', 'The typefaces on every page', [{ text: 'Google Fonts privacy', href: 'https://developers.google.com/fonts/faq/privacy' }]],
          ],
        },
        p('The patient reviews we show are public Google reviews, quoted as written.'),
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies',
      blocks: [
        p('Cookies are small files a website stores on your device. This website does not set its own cookies, and it does not use analytics or advertising trackers.'),
        p('To credit the page or advert that brought you here, the website keeps your first page of the visit and its advertising tags in your browser’s session storage (not a cookie). It is deleted when you close the tab, and is sent to us only with a booking request.'),
        p('The Google Maps and YouTube content described above may set cookies when it loads. You can block or delete cookies in your browser settings. Some embedded content may not work without them.'),
      ],
    },
    {
      id: 'security',
      heading: 'How We Protect It',
      blocks: [
        ul(
          'This website is served over a secure, encrypted connection (HTTPS).',
          'Only staff who need your records for your care or for running the clinic can see them.',
          'We follow reasonable security practices as required by Section 43A of the IT Act.',
        ),
        p('No method of sending or storing information is completely secure, but we work to protect yours.'),
      ],
    },
    {
      id: 'retention',
      heading: 'How Long We Keep It',
      blocks: [
        p('We keep enquiry details only as long as needed to answer and follow up. Medical records are kept for as long as medical-record rules and other laws require. After that, we delete or anonymise them.'),
      ],
    },
    {
      id: 'your-rights',
      heading: 'Your Rights',
      blocks: [
        p('You can ask us to:'),
        ul(
          'Tell you what personal data we hold about you and how we use it',
          'Correct, complete or update it',
          'Delete it, unless the law requires us to keep it (as with medical records)',
          'Stop using it, by withdrawing your consent. This does not affect what we did before.',
          'Let someone you nominate act for you if you die or are unable to',
        ),
        p('Email ', email, ' or write to us at the clinic address. We reply within 30 days. If you are not satisfied, contact our Grievance Officer below.'),
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      blocks: [
        p('We treat patients under 18 only with the consent of a parent or legal guardian, who acts for them on all matters in this policy.'),
      ],
    },
    {
      id: 'other-sites',
      heading: 'Links to Other Websites',
      blocks: [
        p('This website links to other websites, such as our sister clinics, Google and media coverage. Their own privacy policies apply when you visit them.'),
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to This Policy',
      blocks: [p('We may update this policy when our practices or the law change. The latest version is always on this page, with its date at the top.')],
    },
    {
      id: 'grievance-officer',
      heading: 'Grievance Officer',
      blocks: [
        p('Under the Information Technology Act and its rules, you can raise any concern about your personal data with our Grievance Officer:'),
        {
          type: 'contact',
          rows: [
            ['Name', ['Dr Sandeep Mahapatra']],
            ['Email', [email]],
            ['Phone', [phone]],
            ['Address', [`${clinic.legalEntity} (NeoSculpt6), ${postal}`]],
          ],
        },
        p('We acknowledge complaints promptly and resolve them within one month.'),
      ],
    },
  ] satisfies Section[],
}
