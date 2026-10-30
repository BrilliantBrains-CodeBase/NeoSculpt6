// The initials shown where a doctor has no approved portrait yet. Decorative: the doctor's name is always in the
// text beside it. The caller sets the shape and size (the hero fills its photo column; cards use a circle).

export function DoctorAvatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`grid place-items-center bg-border font-heading text-tertiary uppercase ${className}`}>
      {initials}
    </div>
  )
}
