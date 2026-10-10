export default function ProjectCard({ project }) {
  const repoHref = project.repoUrl.startsWith('http')
    ? project.repoUrl
    : `https://github.com/${project.repoUrl}`

  return (
    <div
      className="flex flex-col rounded-xl border p-5 transition hover:shadow-md"
      style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-surface)' }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold" style={{ color: 'var(--ph-text)' }}>
          {project.title}
        </h3>
        {typeof project.stars === 'number' && (
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-amber-500">
            ⭐ {project.stars}
          </span>
        )}
      </div>
      <p className="mb-4 flex-1 text-sm" style={{ color: 'var(--ph-muted)' }}>
        {project.description}
      </p>
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--ph-muted)' }}>
        {project.language && (
          <span className="rounded-full px-2 py-0.5" style={{ background: 'var(--ph-surface-alt)' }}>
            {project.language}
          </span>
        )}
        <div className="flex gap-3">
          <a href={repoHref} target="_blank" rel="noreferrer" className="font-medium" style={{ color: 'var(--ph-primary)' }}>
            Code
          </a>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="font-medium" style={{ color: 'var(--ph-primary)' }}>
              Live demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
