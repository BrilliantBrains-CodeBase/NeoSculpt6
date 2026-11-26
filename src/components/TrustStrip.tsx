// The short trust / quick-facts line under a page banner's buttons ("Doctor-led · Image-guided · No strip
// incision"): small caps-style items split by gold dots, wrapping on phones. Reads as one list for screen readers.

export function TrustStrip({ items, label = 'At a glance', className = '' }: { items: string[]; label?: string; className?: string }) {
  if (!items.length) return null
  return (
    <ul aria-label={label} className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-meta text-secondary uppercase ${className}`}>
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-x-3">
          {i > 0 && (
            <span aria-hidden="true" className="size-1 rounded-full bg-tertiary" />
          )}
          {item}
        </li>
      ))}
    </ul>
  )
}
