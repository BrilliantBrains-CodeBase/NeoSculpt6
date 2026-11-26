// Dr Saranya T no longer appears on the site (user, 2026-11-04): Dr Thyagaraj takes her place on every page.
// The content docs (content/service/*.md, content/technology/*.md) still name her and are never edited, so the two
// parsers pass each doc card through replaceDoctor() / replaceTechDoctor() before writing parsed.json. Her name and
// words then never reach the built site, its JavaScript included.
//
// Her doc paragraphs described her own background (burns-centre years, documented gynaecomastia work and so on), so
// they are not reused under his name. Each page gets its own paragraphs below, written only from Dr Thyagaraj's
// approved facts in doctors.json: MBBS, MS General Surgery, MCh Plastic Surgery, the Masters in Reconstructive
// Breast Surgery, his listed training, and the breast, body, facial, reconstruction and burn work on his profile.
// Needs medical review with the rest of the copy.

import { approved, doctorBySlug } from './doctors.ts'

const thyagaraj = doctorBySlug('dr-thyagaraj')

/** His degrees, as chips. */
export const thyagarajChips = approved(thyagaraj.qualifications)
  .filter((q) => q.type === 'education')
  .map((q) => q.title)

const PARAGRAPHS: Record<string, string[]> = {
  '/cosmetic-surgery/advanced-trauma-reconstruction-in-bangalore/': [
    'Dr Thyagaraj’s work includes complex reconstruction, with training in microvascular surgery and experience of nerve and muscle transfers. Consultation should identify the structures involved, current functional problems, the condition of scars and tissue, and any previous treatment.',
    'His focus is reconstruction planning, safety, realistic goals, the possibility of staged correction and clear rehabilitation guidance, rather than promising complete restoration.',
  ],
  '/cosmetic-surgery/blepharoplasty-eyelid-surgery-in-bangalore/': [
    'Dr Thyagaraj is a senior plastic surgeon trained in plastic and reconstructive surgery in India and Europe, and his work includes facial surgery. Discussion starts with the specific concern, surrounding anatomy, tissue quality, scarring considerations and how healing may affect the final result. His consultations focus on careful assessment, treatment planning, safety, realistic expectations and clear recovery guidance, without implying that any particular eyelid procedure is automatically suitable.',
  ],
  '/cosmetic-surgery/breast-augmentation-surgery-in-bangalore/': [
    'Dr Thyagaraj holds a Masters in Reconstructive Breast Surgery from Barcelona and trained in aesthetic breast surgery in Zurich and implant-based breast reconstruction in Brussels. Consultation planning starts with chest and breast anatomy, tissue coverage, proportion and the patient’s goals, not a promised cup size.',
    'His consultations focus on personalised implant planning, incision and scar discussion, safety considerations, realistic expectations and recovery guidance. The final plan is based on examination and informed consent.',
  ],
  '/cosmetic-surgery/breast-lift-surgery-mastopexy-in-bangalore/': [
    'Dr Thyagaraj’s training includes aesthetic breast surgery and oncoplastic breast reconstruction, and his breast work covers lift, augmentation, reduction and reconstruction. A breast lift discussion should assess skin laxity, nipple position, existing volume and the patient’s desired degree of reshaping.',
    'His focus is personalised assessment, scar-pattern discussion, realistic expectations, safety and recovery guidance, without implying that every patient needs the same lifting technique.',
  ],
  '/cosmetic-surgery/breast-reduction-surgery-in-bangalore/': [
    'Breast reduction is part of Dr Thyagaraj’s breast surgery work, alongside a Masters in Reconstructive Breast Surgery and training in aesthetic breast surgery. Consultation should consider breast size, symptoms, asymmetry, skin quality, nipple position, scar patterns and the patient’s priorities before a reduction plan is discussed.',
    'His approach supports informed decision-making through careful assessment, realistic discussion of size change and scars, safety considerations and clear recovery and follow-up guidance.',
  ],
  '/cosmetic-surgery/burn-scar-reconstruction-surgery-in-bangalore/': [
    'Burn deformity correction is part of Dr Thyagaraj’s plastic and reconstructive work, which is directly relevant to assessing burn scars that affect appearance, comfort or movement.',
    'His role is to define the functional and cosmetic problem, assess scar quality and tissue availability, discuss whether treatment may need to be staged, and give realistic guidance on wound care, rehabilitation and scar maturation.',
  ],
  '/cosmetic-surgery/dimple-creation-surgery-in-bangalore/': [
    'Dr Thyagaraj’s plastic surgery training and his work in facial surgery are relevant to consultation for dimple creation. The discussion considers facial symmetry, smile dynamics, desired dimple position and the fact that small differences in tissue and healing can affect the result.',
    'His focus is personalised assessment, conservative planning, safety, realistic expectations and aftercare, so the patient understands both the intended change and the limitations before deciding.',
  ],
  '/cosmetic-surgery/ear-lobe-repair-surgery-in-bangalore/': [
    'Dr Thyagaraj’s plastic and reconstructive surgery background is relevant to earlobe repair, where the pattern of the split, scar tissue, remaining healthy tissue and future piercing plans all influence treatment planning.',
    'His focus is careful examination, a repair plan matched to the tissue available, realistic scar expectations and clear wound-care and recovery guidance rather than promising a fixed cosmetic result.',
  ],
  '/cosmetic-surgery/facelift-surgery-in-bangalore/': [
    'Dr Thyagaraj’s work includes facial surgery and facial contouring, relevant to facial ageing concerns. Consultation separates skin laxity, deeper tissue changes, facial proportions and patient priorities before a surgical plan is considered.',
    'His role is to support informed decisions through careful assessment, realistic discussion of scars and recovery, and a plan based on the patient’s anatomy rather than a standard template.',
  ],
  '/cosmetic-surgery/gynecomastia-surgery-in-bangalore/': [
    'Dr Thyagaraj is a senior plastic surgeon (MS, MCh) whose body-contouring work includes liposuction. Consultation determines whether chest fullness is mainly gland, fat or a combination, while considering skin quality, asymmetry and the patient’s goals.',
    'His focus is an anatomy-led plan, clear discussion of scars and contour limits, and safety and recovery guidance so patients understand what the correction is intended to address.',
  ],
  '/cosmetic-surgery/head-neck-reconstruction-surgery-in-bangalore/': [
    'Dr Thyagaraj’s training in microvascular surgery and his work in complex reconstruction are relevant to head and neck defects, where form, function and tissue needs must be weighed together.',
    'His focus is careful defect assessment, reconstructive options, functional priorities, safety, realistic expectations and, where needed, staged care or rehabilitation.',
  ],
  '/cosmetic-surgery/liposuction-surgery-in-bangalore/': [
    'Liposuction is part of Dr Thyagaraj’s body-contouring work, alongside abdominoplasty. Consultations assess the areas of concern, body proportions and skin quality, and whether the goal suits contouring rather than weight loss.',
    'His approach focuses on personalised planning, extent of treatment, safety, realistic expectations, compression care where relevant, and a clear recovery discussion before the patient decides.',
  ],
  '/cosmetic-surgery/mommy-makeover-surgery-in-bangalore/': [
    'Dr Thyagaraj’s work covers breast surgery, liposuction and abdominoplasty, which are relevant to a combined post-pregnancy body-contouring plan. Consultation first identifies which concerns matter most and whether combining procedures is appropriate for the individual patient.',
    'His approach emphasises sequencing, safety, realistic expectations, scar and recovery planning, and whether a staged approach may be more appropriate than addressing every concern in one operation.',
  ],
  '/cosmetic-surgery/post-surgical-correction-surgery-in-bangalore/': [
    'Dr Thyagaraj’s plastic and reconstructive training, in India and Europe, is relevant to patients considering correction after previous surgery. Assessment reviews the original procedure, current anatomy, scar tissue, symptoms and the patient’s goals.',
    'His approach emphasises realistic revision planning, safety, the limits set by prior surgery and healing, whether correction should be staged, and recovery guidance before any new procedure.',
  ],
  '/cosmetic-surgery/rhinoplasty-in-bangalore/': [
    'Rhinoplasty consultation reviews nasal structure, facial proportions, skin and soft tissue, scarring considerations and recovery expectations. Rhinoplasty is part of Dr Thyagaraj’s facial surgery work.',
    'His consultations focus on the patient’s concerns, the anatomy affecting the plan, realistic limits of change, and clear explanation of recovery and follow-up before any decision.',
  ],
  '/cosmetic-surgery/scar-revision-surgery-in-bangalore/': [
    'Scar revision and burn deformity correction are both part of Dr Thyagaraj’s plastic and reconstructive work, and both need careful scar and tissue assessment. Consultation first defines whether the main concern is appearance, discomfort, restriction or a combination.',
    'His approach focuses on matching the method to scar type and location, explaining realistic limits of improvement, and planning wound care, scar maturation and follow-up. Scars are not promised to disappear completely.',
  ],
  '/cosmetic-surgery/tummy-tuck-surgery-abdominoplasty-in-bangalore/': [
    'Abdominoplasty and liposuction are both part of Dr Thyagaraj’s body-contouring work. A tummy tuck consultation separates excess skin, localised fat, abdominal wall concerns, scar placement and recovery needs before a surgical plan is discussed. His approach centres on careful examination, proportionate planning, safety, realistic expectations about scars and contour, and practical recovery guidance rather than a standard package.',
  ],
  '/cosmetic-surgery/xanthelasma-removal-treatment-in-bangalore/': [
    'Dr Thyagaraj’s plastic surgery training gives a surgical perspective when assessing xanthelasma. Because eyelid skin is delicate, lesion size, depth, location, scar risk and pigment change all shape the decision.',
    'His role is assessment and planning: clarifying the concern, discussing whether surgery is appropriate, explaining realistic cosmetic limits, and outlining healing and follow-up. No single method suits every patient.',
  ],
  '/cosmetic-surgery/chin-augmentation-surgery-in-bangalore/': [
    'Dr Thyagaraj’s plastic surgery training and his work in facial surgery and facial contouring support planning when chin augmentation is combined with rhinoplasty, neck liposuction or other facial procedures. His focus is careful assessment, safety, realistic expectations and clear recovery guidance, without implying that any particular procedure is automatically suitable.',
  ],
  '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/': [
    'Dr Thyagaraj is a senior plastic surgeon whose body-contouring work includes abdominoplasty and liposuction. That background matters when post-pregnancy changes combine localised fat, loose skin and abdominal-wall concerns.',
    'His consultations separate these components before selecting treatment and explain what non-surgical contouring can realistically achieve. If surgery is being considered, the discussion covers scars, safety, recovery and realistic outcomes before any decision.',
  ],
  '/slimming-body-contouring/post-weight-loss-body-planning-in-bangalore/': [
    'Dr Thyagaraj is a senior plastic surgeon whose work covers liposuction, abdominoplasty, body contouring and complex reconstruction. For patients planning their next step after major weight loss, this background is relevant when loose skin, residual fat and tissue redundancy need to be assessed separately.',
    'His consultation looks at weight stability, skin excess, contour concerns, previous procedures and recovery priorities before discussing whether non-surgical care, surgical evaluation or a staged plan is more appropriate. The emphasis is on safety, realistic expectations and a recovery plan that matches the treatment being considered.',
  ],
  '/slimming-body-contouring/post-weight-loss-loose-skin-treatment-in-bangalore/': [
    'Dr Thyagaraj is a senior plastic surgeon whose work covers abdominoplasty, liposuction and body contouring. This is relevant when loose skin after major weight loss may be more than a mild laxity concern and needs an anatomy-led assessment. During consultation, the degree and location of skin excess, residual fat, scar considerations and recovery needs are reviewed before a treatment pathway is discussed. Patients are given a realistic explanation of the limits of non-surgical tightening and when surgical evaluation may be more appropriate.',
  ],
}

type DocCard = { name: string; chips?: string[] | null; blockEyebrow?: string | null; paragraphs?: string[] }

/** True when a doc card names Dr Saranya. */
export const isReplaced = (name: string) => /saranya/i.test(name)

/** A doc card that names Dr Saranya, as Dr Thyagaraj's: his name, degrees, eyebrow and this page's paragraphs. Any
 *  other card comes back unchanged. A page with no paragraphs written here stops the build. */
export function replaceDoctor<T extends DocCard>(path: string, card: T, { needsParagraphs = true } = {}): T {
  if (!isReplaced(card.name)) return card
  const paragraphs = PARAGRAPHS[path]
  if (needsParagraphs && !paragraphs) throw new Error(`replaced-doctors.ts: no Dr Thyagaraj paragraphs for ${path}`)
  return {
    ...card,
    name: thyagaraj.displayName,
    chips: card.chips === null ? null : thyagarajChips,
    blockEyebrow: card.blockEyebrow ? 'Meet Dr Thyagaraj' : card.blockEyebrow,
    ...(paragraphs ? { paragraphs } : {}),
  }
}

type TechCard = { name: string; chips: string[] | null; qualifications: string | null; button: { label: string; href: string } | null }

/** A technology-doc card naming Dr Saranya, as Dr Thyagaraj's: his name, degrees and profile link. The doc's one-line
 *  relevance text ("cosmetic surgery, body contouring and reconstructive care") fits him and is kept. */
export function replaceTechDoctor<T extends TechCard>(card: T): T {
  if (!isReplaced(card.name)) return card
  return {
    ...card,
    name: thyagaraj.displayName,
    chips: card.chips ? thyagarajChips : card.chips,
    qualifications: card.qualifications ? `${thyagarajChips.join(', ')}.` : card.qualifications,
    button: card.button ? { label: 'Meet Dr Thyagaraj', href: thyagaraj.path } : card.button,
  }
}
