import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { addDoc, deleteDoc, listDocs, updateDoc } from '../../lib/db'
import { fetchRepoStats, parseRepo } from '../../lib/github'
import SectionCard from './SectionCard'

const emptyForm = { title: '', description: '', repoUrl: '', liveUrl: '' }

export default function ProjectsEditor() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [refreshingId, setRefreshingId] = useState(null)

  async function load() {
    setLoading(true)
    const list = await listDocs('projects', { authorId: user.uid })
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    setProjects(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.repoUrl.trim()) {
      setError('Title and GitHub repo are required.')
      return
    }
    if (!parseRepo(form.repoUrl)) {
      setError('Enter a valid GitHub repo, like owner/repo or a full github.com URL.')
      return
    }
    setSaving(true)
    try {
      const stats = await fetchRepoStats(form.repoUrl)
      const project = await addDoc('projects', {
        authorId: user.uid,
        title: form.title.trim(),
        description: form.description.trim(),
        repoUrl: form.repoUrl.trim(),
        liveUrl: form.liveUrl.trim(),
        stars: stats?.stars ?? null,
        forks: stats?.forks ?? null,
        language: stats?.language ?? null,
        order: projects.length,
      })
      setProjects((p) => [...p, project])
      setForm(emptyForm)
    } finally {
      setSaving(false)
    }
  }

  async function refreshStars(project) {
    setRefreshingId(project.id)
    const stats = await fetchRepoStats(project.repoUrl)
    if (stats) {
      const updated = await updateDoc('projects', project.id, {
        stars: stats.stars,
        forks: stats.forks,
        language: stats.language,
      })
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, ...updated } : p)))
    }
    setRefreshingId(null)
  }

  async function remove(id) {
    await deleteDoc('projects', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-900">Projects showcase</h1>

      <SectionCard
        title="Add a project"
        description="Link a public GitHub repo — its live star count is pulled from the GitHub API."
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Project title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="GitHub repo (owner/repo or URL)"
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
            />
          </div>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Short description of what this project does"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Live demo URL (optional)"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Fetching GitHub stats…' : 'Add project'}
          </button>
        </form>
      </SectionCard>

      {loading ? (
        <p className="text-sm text-slate-400">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-slate-400">No projects yet — add your first repo above.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{p.title}</div>
                  <a
                    href={p.repoUrl.startsWith('http') ? p.repoUrl : `https://github.com/${p.repoUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-xs text-indigo-600 hover:underline"
                  >
                    {p.repoUrl}
                  </a>
                  {p.description && <p className="mt-1 text-sm text-slate-500">{p.description}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right text-xs text-slate-500">
                    <div className="font-semibold text-amber-500">
                      {p.stars === null ? '—' : `⭐ ${p.stars}`}
                    </div>
                    {p.language && <div>{p.language}</div>}
                  </div>
                  <button
                    onClick={() => refreshStars(p)}
                    disabled={refreshingId === p.id}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
                  >
                    {refreshingId === p.id ? '…' : '↻'}
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-md px-2 py-1 text-xs text-slate-300 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
