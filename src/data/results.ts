// /results/ page copy. The before/after gallery isn't built yet (homepage.md §6: a 6-tab gallery of consented cases),
// so the page says it is coming soon. DRAFT copy for sign-off; it isn't in a content doc.
// The page is noindex and out of the sitemap until the gallery goes live (robots in src/data/hubs.ts).
export const resultsComingSoon = {
  eyebrow: 'Results Gallery',
  status: 'Coming Soon',
  text: "We're preparing a gallery of before-and-after cases across hair, body, skin, anti-ageing and cosmetic surgery. Every case will be shared only with the patient's written consent.",
  ctas: [
    { label: 'Book a Consultation', action: 'book' as const },
    { label: 'Explore Our Specialities', href: '/#specialities' },
  ],
}
