import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { findMyTreatment, primaryNav, type MegaColumn, type NavItem, type NavLink } from '../../data/nav'
import { SmartLink } from '../SmartLink'
import { ChevronDownIcon } from '../icons'

// Rejuvita nav menu widget 7231320 (elementor/css/post-120.css): Manrope 13px/500, 2px tracking, uppercase,
// `secondary`, hover and current item `tertiary`, 30px apart, 5px chevron 7px after the label.
// Submenus open on hover, or from the chevron button (keyboard, touch, screen readers). Every
// submenu link is in the prerendered HTML (hidden with `visibility`), so crawlers see the full menu.

export function isCurrent(item: NavItem, pathname: string) {
  const paths = [item, ...(item.children ?? []), ...(item.mega ?? [])].map((l) => l.href).filter((h) => !h.includes('#'))
  return paths.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))
}

const itemText = 'type-accent font-medium uppercase'
// Panels fade like the theme's dropdowns (0.3s); `invisible` also takes the hidden links out of the tab order.
const panelState = (open: boolean) =>
  `transition-[opacity,visibility] duration-300 motion-reduce:transition-none ${open ? 'visible opacity-100' : 'invisible opacity-0'}`

export function DesktopNav({ className = '' }: { className?: string }) {
  const { pathname } = useLocation()
  const [openLabel, setOpenLabel] = useState<string | null>(null)

  const navRef = useRef<HTMLElement>(null)

  // Close on navigation, and on a tap/click outside the menu.
  useEffect(() => setOpenLabel(null), [pathname])
  useEffect(() => {
    if (!openLabel) return
    const onDown = (e: PointerEvent) => !navRef.current?.contains(e.target as Node) && setOpenLabel(null)
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [openLabel])

  return (
    <nav ref={navRef} aria-label="Main" className={className}>
      {/* 30px apart as in the theme; 24px in the compact 1181-1535 row so it clears the button at 1181. */}
      <ul className="flex items-center gap-6 wide:gap-[30px]">
        {primaryNav.map((item) => (
          <NavEntry
            key={item.label}
            item={item}
            current={isCurrent(item, pathname)}
            open={openLabel === item.label}
            setOpen={(o) => setOpenLabel((prev) => (o ? item.label : prev === item.label ? null : prev))}
          />
        ))}
      </ul>
    </nav>
  )
}

function NavEntry({ item, current, open, setOpen }: { item: NavItem; current: boolean; open: boolean; setOpen: (open: boolean) => void }) {
  const ref = useRef<HTMLLIElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hasPanel = Boolean(item.children || item.mega)
  const color = current || open ? 'text-tertiary' : 'text-secondary hover:text-tertiary focus-visible:text-tertiary'

  if (!hasPanel) {
    return (
      <li>
        <SmartLink href={item.href} aria-current={current ? 'page' : undefined} className={`${itemText} block transition-colors duration-300 ${color}`}>
          {item.label}
        </SmartLink>
      </li>
    )
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }
  const panelId = `nav-${item.label.toLowerCase()}`

  return (
    <li
      ref={ref}
      // The mega-menu is positioned against the header row (static li); a dropdown against its item.
      className={item.mega ? 'static' : 'relative'}
      // Disclosure pattern: a mouse opens it on hover, keyboard and touch through the chevron button. Hover is
      // mouse-only so a tap on the chevron (which also fires pointer enter) toggles cleanly.
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
      onKeyDown={onKeyDown}
    >
      <span className={`flex items-center gap-[7px] transition-colors duration-300 ${color}`}>
        <SmartLink href={item.href} aria-current={current ? 'page' : undefined} className={`${itemText} block`}>
          {item.label}
        </SmartLink>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${item.label} menu`}
          onClick={() => setOpen(!open)}
          className="-m-2 p-2"
        >
          <ChevronDownIcon className={`size-[5px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
      </span>
      {item.mega ? <MegaMenu id={panelId} columns={item.mega} open={open} /> : <Dropdown id={panelId} links={item.children!} open={open} />}
    </li>
  )
}

// Rejuvita dropdown: 230px, bg `border`, radius 10, padding 15/25, 25px below the item (the wrapper's top padding is
// the invisible hover bridge). Items: Manrope 14px `text`, 10px vertical padding, bottom border turns `primary` on hover.
function Dropdown({ id, links, open }: { id: string; links: NavLink[]; open: boolean }) {
  return (
    <div id={id} className={`absolute top-full -left-[25px] z-10 pt-[25px] ${panelState(open)}`}>
      <ul className="w-[230px] rounded-[10px] bg-border px-[25px] py-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        {links.map((l) => (
          <li key={l.href}>
            <SmartLink
              href={l.href}
              className="block border-b border-transparent py-2.5 text-[14px] leading-[1.55] text-text transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary"
            >
              {l.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Rejuvita mega-menu template 158 (elementor/css/post-158.css): bg `border`, radius 20, an Aboreto h3 title
// ("View" + a gold link), then image cards (radius 20, darken to 40% black on hover, h5 title -> `primary`).
// Ours has one column per speciality (homepage.md "Specialities mega-menu") with its top treatments under the card,
// so it spans the header row instead of the theme's 1075px, with 60px padding (40px below 1536).
function MegaMenu({ id, columns, open }: { id: string; columns: MegaColumn[]; open: boolean }) {
  return (
    // Item bottom = row centre + half the 22px item line, then the theme's 25px gap as hover bridge.
    <div id={id} className={`absolute inset-x-[30px] top-[calc(50%+11px)] z-10 pt-[25px] wide:inset-x-10 ${panelState(open)}`}>
      <div className="mx-auto max-w-[1360px] rounded-[20px] bg-border p-10 shadow-[0_2px_10px_rgba(0,0,0,0.1)] wide:p-[60px]">
        <div className="mb-[30px] flex items-end justify-between gap-10">
          <p className="font-heading text-h3 text-secondary uppercase">
            View{' '}
            <SmartLink href="/#specialities" className="text-tertiary transition-colors duration-300 hover:text-primary focus-visible:text-primary">
              all specialities
            </SmartLink>
          </p>
          <p className="type-accent pb-2 font-medium text-text uppercase">
            Not sure?{' '}
            <SmartLink href={findMyTreatment.href} className="text-tertiary transition-colors duration-300 hover:text-primary focus-visible:text-primary">
              {findMyTreatment.label} →
            </SmartLink>
          </p>
        </div>
        <ul className="grid grid-cols-6 gap-5 wide:gap-[30px]">
          {columns.map((col) => (
            <li key={col.href}>
              <SmartLink href={col.href} className="group/card block">
                <span className="relative block overflow-hidden rounded-[20px]">
                  <img src={col.image} alt="" width={1024} height={1024} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                  <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover/card:opacity-40 group-focus-visible/card:opacity-40" />
                </span>
                <span className="mt-[15px] block font-heading text-h5 text-secondary transition-colors duration-300 group-hover/card:text-primary group-focus-visible/card:text-primary">
                  {col.label}
                </span>
              </SmartLink>
              <ul className="mt-2.5">
                {col.items.map((l) => (
                  <li key={l.href}>
                    <SmartLink
                      href={l.href}
                      className="block py-[5px] text-[14px] leading-[1.45] text-text transition-colors duration-300 hover:text-primary focus-visible:text-primary"
                    >
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
