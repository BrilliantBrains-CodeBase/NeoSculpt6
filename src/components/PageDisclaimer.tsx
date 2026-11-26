// The doc's small print at the foot of a page ("Results vary from person to person. This page is for patient
// education …"), between the closing band and the Instagram row. Left on phones, centred from tablet up.

export function PageDisclaimer({ text }: { text: string | null | undefined }) {
  if (!text) return null
  return (
    <aside
      id="page-disclaimer"
      aria-label="Disclaimer"
      className="mx-auto mb-[60px] w-full max-w-[960px] px-5 text-center text-meta text-text max-md:text-left md:mb-20 md:px-[30px]"
    >
      <p>{text}</p>
    </aside>
  )
}
