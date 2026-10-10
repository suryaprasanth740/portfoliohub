import { useEffect, useState } from 'react'
import { scrollToId } from '../../lib/scrollToId'

/**
 * Sticky sidebar table of contents, generated from the post's H2/H3
 * headings (see lib/toc.js). Highlights the section currently in view.
 */
export default function TableOfContents({ toc }) {
  const [activeId, setActiveId] = useState(toc[0]?.id)

  useEffect(() => {
    if (toc.length === 0) return
    const headingEls = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 }
    )

    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 text-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ph-muted)' }}>
        On this page
      </div>
      <ul className="space-y-1.5 border-l" style={{ borderColor: 'var(--ph-border)' }}>
        {toc.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.depth === 3 ? '1.75rem' : '1rem' }}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(item.id)
              }}
              className="block truncate border-l-2 -ml-px pl-3 py-0.5 transition"
              style={{
                borderColor: activeId === item.id ? 'var(--ph-primary)' : 'transparent',
                color: activeId === item.id ? 'var(--ph-primary)' : 'var(--ph-muted)',
                fontWeight: activeId === item.id ? 600 : 400,
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
