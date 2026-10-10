import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { useAuth } from '../../context/AuthContext'
import { addDoc, getDoc, listDocs, updateDoc } from '../../lib/db'
import { uploadFile } from '../../lib/storage'
import { readingTimeMinutes } from '../../lib/toc'

const AUTOSAVE_INTERVAL_MS = 30000

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

const emptyForm = { title: '', body: '', coverImageUrl: '', tags: '', status: 'draft' }

export default function BlogPostForm() {
  const { postId } = useParams()
  const isNew = !postId
  const { user } = useAuth()
  const navigate = useNavigate()

  const draftKey = `portfoliohub:draft:${user.uid}:${postId || 'new'}`

  const [form, setForm] = useState(emptyForm)
  const [existingPost, setExistingPost] = useState(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [autosaveState, setAutosaveState] = useState('idle') // idle | saving | saved
  const [restoreBanner, setRestoreBanner] = useState(null)

  const formRef = useRef(form)
  useEffect(() => {
    formRef.current = form
  }, [form])

  // Load the post (if editing) and check for a local autosaved draft.
  useEffect(() => {
    let cancelled = false
    async function load() {
      let base = emptyForm
      if (!isNew) {
        const post = await getDoc('posts', postId)
        if (post) {
          base = {
            title: post.title,
            body: post.body,
            coverImageUrl: post.coverImageUrl || '',
            tags: (post.tags || []).join(', '),
            status: post.status,
          }
          if (!cancelled) setExistingPost(post)
        }
      }
      if (!cancelled) {
        setForm(base)
        setLoading(false)
      }

      try {
        const raw = localStorage.getItem(draftKey)
        if (raw) {
          const draft = JSON.parse(raw)
          const draftHasContent = draft.title || draft.body
          if (draftHasContent && !cancelled) {
            setRestoreBanner(draft)
          }
        }
      } catch {
        // ignore malformed draft
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  // Auto-save the in-progress draft to localStorage every 30 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      const current = formRef.current
      if (!current.title.trim() && !current.body.trim()) return
      setAutosaveState('saving')
      localStorage.setItem(draftKey, JSON.stringify({ ...current, savedAt: Date.now() }))
      window.setTimeout(() => setAutosaveState('saved'), 500)
    }, AUTOSAVE_INTERVAL_MS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey])

  const readingTime = useMemo(() => readingTimeMinutes(form.body), [form.body])
  const wordCount = useMemo(
    () => form.body.trim().split(/\s+/).filter(Boolean).length,
    [form.body]
  )

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  function restoreDraft() {
    if (restoreBanner) {
      const { savedAt: _savedAt, ...rest } = restoreBanner
      setForm(rest)
    }
    setRestoreBanner(null)
  }

  function discardDraft() {
    localStorage.removeItem(draftKey)
    setRestoreBanner(null)
  }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadFile('blog-covers', file)
      update({ coverImageUrl: url })
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleSave(status) {
    setError('')
    if (!form.title.trim()) {
      setError('Give your post a title before saving.')
      return
    }
    setSaving(true)
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        authorId: user.uid,
        title: form.title.trim(),
        body: form.body,
        coverImageUrl: form.coverImageUrl,
        tags,
        status,
        readingTime,
      }

      if (isNew) {
        let slug = slugify(form.title)
        const siblings = await listDocs('posts', { authorId: user.uid })
        const taken = new Set(siblings.map((p) => p.slug))
        let candidate = slug || 'post'
        let i = 2
        while (taken.has(candidate)) {
          candidate = `${slug}-${i++}`
        }
        payload.slug = candidate
        payload.publishedAt = status === 'published' ? new Date().toISOString() : null
        const created = await addDoc('posts', payload)
        localStorage.removeItem(draftKey)
        navigate(`/dashboard/blog/${created.id}`, { replace: true })
      } else {
        const patch = { ...payload }
        if (status === 'published' && existingPost?.status !== 'published') {
          patch.publishedAt = new Date().toISOString()
        }
        const updated = await updateDoc('posts', postId, patch)
        setExistingPost((prev) => ({ ...prev, ...updated }))
        localStorage.removeItem(draftKey)
      }
    } catch (err) {
      setError(err.message || 'Could not save this post.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-400">Loading post…</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/blog')}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          ← Back to posts
        </button>
        <div className="flex items-center gap-3 text-xs">
          {autosaveState === 'saving' && <span className="text-slate-400">Saving draft locally…</span>}
          {autosaveState === 'saved' && <span className="text-emerald-600">Draft auto-saved ✓</span>}
        </div>
      </div>

      {restoreBanner && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          <span>You have unsaved local changes from an earlier session.</span>
          <div className="flex gap-2">
            <button onClick={restoreDraft} className="font-semibold underline">
              Restore
            </button>
            <button onClick={discardDraft} className="text-amber-600 underline">
              Discard
            </button>
          </div>
        </div>
      )}

      <input
        className="mb-3 w-full border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300 focus:border-indigo-500"
        placeholder="Post title"
        value={form.title}
        onChange={(e) => update({ title: e.target.value })}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Cover image</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              {uploadingCover ? 'Uploading…' : form.coverImageUrl ? 'Change image' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
            {form.coverImageUrl && (
              <img src={form.coverImageUrl} alt="Cover" className="h-9 w-14 rounded object-cover" />
            )}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Tags (comma-separated)</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="react, firebase, webdev"
            value={form.tags}
            onChange={(e) => update({ tags: e.target.value })}
          />
        </div>
      </div>

      <div data-color-mode="light" className="mb-4">
        <MDEditor
          value={form.body}
          onChange={(v) => update({ body: v || '' })}
          height={480}
          preview="live"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{readingTime} min read (auto-calculated)</span>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          <select
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            value={form.status}
            onChange={(e) => update({ status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            disabled={saving}
            onClick={() => handleSave(form.status)}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            Save
          </button>
          <button
            disabled={saving}
            onClick={() => handleSave('published')}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
