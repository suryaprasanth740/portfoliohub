import { useEffect, useState } from 'react'
import { scrollToId } from '../../lib/scrollToId'

/**
 * Sticky in-page nav for the public portfolio. Only lists sections that
 * actually exist on this profile (a portfolio with no blog posts, for
 * instance, never shows a "blog" link), and highlights whichever section
 * is currently in view so long pages stay easy to navigate.
 */
export default function PublicNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  if (sections.length < 2) return null

  return (
    <nav
      className="sticky top-0 z-20 flex justify-center gap-1 overflow-x-auto border-b px-4 py-2 backdrop-blur"
      style={{ borderColor: 'var(--ph-border)', background: 'color-mix(in srgb, var(--ph-surface) 85%, transparent)' }}
    >
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollToId(s.id)}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition"
          style={{
            color: active === s.id ? 'var(--ph-primary)' : 'var(--ph-muted)',
            background: active === s.id ? 'var(--ph-surface-alt)' : 'transparent',
          }}
        >
          {s.label}
        </button>
      ))}
    </nav>
  )
}
