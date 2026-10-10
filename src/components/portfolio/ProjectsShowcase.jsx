import { useEffect, useState } from 'react'
import { fetchRepoStats } from '../../lib/github'
import ProjectCard from './ProjectCard'

/**
 * Public projects showcase. Fetches live star counts from the GitHub API on
 * render (cached for an hour, see lib/github.js) so visitors always see a
 * current count rather than whatever was cached when the owner last edited
 * the project in their dashboard.
 */
export default function ProjectsShowcase({ projects }) {
  const [liveProjects, setLiveProjects] = useState(projects || [])
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    setLiveProjects(projects || [])
    let cancelled = false
    async function hydrate() {
      const updated = await Promise.all(
        (projects || []).map(async (p) => {
          const stats = await fetchRepoStats(p.repoUrl)
          return stats ? { ...p, stars: stats.stars, forks: stats.forks, language: stats.language } : p
        })
      )
      if (!cancelled) setLiveProjects(updated)
    }
    if (projects && projects.length > 0) hydrate()
    return () => {
      cancelled = true
    }
  }, [projects])

  if (!liveProjects || liveProjects.length === 0) return null

  // Only worth showing a language filter once there's more than one
  // language to actually filter between.
  const languages = [...new Set(liveProjects.map((p) => p.language).filter(Boolean))]
  const filtered =
    activeFilter === 'all' ? liveProjects : liveProjects.filter((p) => p.language === activeFilter)

  return (
    <section id="projects" className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--ph-text)' }}>
          Projects
        </h2>
        {languages.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {['all', ...languages].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveFilter(lang)}
                className="rounded-full px-3 py-1 text-xs font-medium capitalize transition"
                style={{
                  color: activeFilter === lang ? 'var(--ph-primary)' : 'var(--ph-muted)',
                  background: activeFilter === lang ? 'var(--ph-surface-alt)' : 'transparent',
                  border: `1px solid ${activeFilter === lang ? 'var(--ph-primary)' : 'var(--ph-border)'}`,
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
