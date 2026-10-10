import { useEffect, useState } from 'react'

/**
 * Fixed progress bar at the top of the post detail page, filling as the
 * reader scrolls: window.scrollY / document.body.scrollHeight, per spec.
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const pct = (window.scrollY / document.body.scrollHeight) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-black/5">
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%`, background: 'var(--ph-primary, #6366f1)' }}
      />
    </div>
  )
}
