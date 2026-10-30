import { useId } from 'react'
import { clinic } from '../data/site'
import { useModal } from './useModal'
import { usePresence } from './usePresence'
import { CloseIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from './icons'

// Bottom sheet opened by the mobile bar's "Follow" item (phones only). Lists the clinic's social profiles; a row
// shows only once its URL is filled in (clinic.social), the same rule as the footer icons. Sits above the bar
// (z-9990) and below the booking popup (z-10000). Rendered only while open, so nothing reaches the prerendered page.
const profiles = [
  { label: 'Instagram', href: clinic.social.instagram, icon: <InstagramIcon className="size-[22px]" /> },
  { label: 'Facebook', href: clinic.social.facebook, icon: <FacebookIcon className="size-[22px]" /> },
  { label: 'YouTube', href: clinic.social.youtube, icon: <YoutubeIcon className="size-[22px]" /> },
].filter((p) => p.href)

export function FollowSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mounted, shown } = usePresence(open, 300)
  const ref = useModal<HTMLDivElement>(open && mounted, onClose)
  const titleId = useId()
  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[9995] flex items-end bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${shown ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full rounded-t-[20px] bg-alternate px-5 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_30px_rgba(0,0,0,0.15)] outline-none transition-transform duration-300 ${shown ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <h2 id={titleId} className="pr-10 font-heading text-h5 text-secondary uppercase">
          Follow NeoSculpt6
        </h2>

        {profiles.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-2">
            {profiles.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-[10px] bg-background px-4 py-3.5 text-small font-semibold text-secondary transition-colors duration-300 hover:text-primary focus-visible:text-primary"
                >
                  {p.icon}
                  {p.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-small text-text">Our social pages are coming soon.</p>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-1 text-secondary transition-colors duration-300 hover:text-primary focus-visible:text-primary"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
