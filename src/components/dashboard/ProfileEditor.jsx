import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { uploadFile } from '../../lib/storage'
import SectionCard, { SaveStatus } from './SectionCard'
import ThemeSwitcher from './ThemeSwitcher'

export default function ProfileEditor() {
  const { profile, saveProfile } = useProfile()
  const [form, setForm] = useState(profile)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => setForm(profile), [profile])

  if (!form) return null

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  async function handleAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile('avatars', file)
      update({ avatarUrl: url })
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setStatus('saving')
    setError('')
    try {
      await saveProfile(form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1800)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        <div className="flex items-center gap-3">
          <SaveStatus state={status} />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Save changes
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <SectionCard title="Basics" description="How you introduce yourself on your portfolio.">
        <div className="flex items-center gap-4">
          <div className="relative">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-xl text-slate-400">
                {(form.displayName || '?')[0]}
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {uploading ? 'Uploading…' : 'Change photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            <p className="mt-1 text-[11px] text-slate-400">Compressed automatically before upload.</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Display name</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={form.displayName || ''}
              onChange={(e) => update({ displayName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Headline / title</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={form.title || ''}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Frontend Developer & CS Student"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-slate-600">Bio</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            value={form.bio || ''}
            onChange={(e) => update({ bio: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-slate-600">Portfolio username</label>
          <div className="flex items-center overflow-hidden rounded-lg border border-slate-300 focus-within:border-indigo-500">
            <span className="bg-slate-50 px-3 py-2 text-sm text-slate-400">portfoliohub.app/p/</span>
            <input
              className="flex-1 px-2 py-2 text-sm outline-none"
              value={form.username || ''}
              onChange={(e) => update({ username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Color theme" description="Applied instantly across your public portfolio.">
        <ThemeSwitcher value={form.theme} onChange={(theme) => update({ theme })} />
      </SectionCard>

      <SectionCard title="Social links" description="Shown as icons in your portfolio header.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {['github', 'linkedin', 'twitter', 'website'].map((key) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium capitalize text-slate-600">{key}</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={form.socials?.[key] || ''}
                onChange={(e) => update({ socials: { ...form.socials, [key]: e.target.value } })}
                placeholder={key === 'website' ? 'https://yoursite.dev' : `https://${key}.com/username`}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </form>
  )
}
