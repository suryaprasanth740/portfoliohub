import { useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { isFirebaseConfigured } from '../../lib/firebase'
import SectionCard, { SaveStatus } from './SectionCard'

export default function PublishPanel() {
  const { profile, saveProfile } = useProfile()
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  if (!profile) return null

  const missingUsername = !profile.username

  const shareUrl = `${window.location.origin}/p/${profile.username || ''}`

  async function togglePublished() {
    if (missingUsername) {
      setError('Set a portfolio username on the Profile tab before publishing.')
      setStatus('error')
      return
    }
    setBusy(true)
    setStatus('saving')
    setError('')
    try {
      await saveProfile({ published: !profile.published })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1800)
    } catch (err) {
      console.error('Publish toggle failed:', err)
      setError(err?.message || 'Something went wrong while publishing. Please try again.')
      setStatus('error')
    } finally {
      setBusy(false)
    }
  }

  function copyLink() {
    navigator.clipboard?.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Publish</h1>
        <SaveStatus state={status} />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <SectionCard
        title={profile.published ? 'Your portfolio is live' : 'Your portfolio is unpublished'}
        description={
          profile.published
            ? 'Anyone with the link below can view it.'
            : 'Publish to make it visible at your shareable URL.'
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={togglePublished}
            disabled={busy}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              profile.published ? 'bg-slate-600 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {busy ? 'Updating…' : profile.published ? 'Unpublish' : 'Publish portfolio 🚀'}
          </button>

          <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <span className="truncate px-3 py-2 text-sm text-slate-600">{shareUrl}</span>
            <button
              onClick={copyLink}
              disabled={missingUsername}
              className="shrink-0 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-slate-100 disabled:opacity-40"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </div>
        {missingUsername && (
          <p className="mt-2 text-xs text-amber-600">
            You haven't set a portfolio username yet — add one on the Profile tab first.
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Hosting"
        description={
          isFirebaseConfigured
            ? 'This workspace is connected to a real Firebase project, so every save here is live immediately.'
            : 'This workspace runs on a local demo backend by default. Go fully live in a few steps.'
        }
      >
        {isFirebaseConfigured ? (
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected to Firebase
            </span>
            <a
              href={window.location.origin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              {window.location.host} ↗
            </a>
          </div>
        ) : (
          <>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Create a Firebase project, then copy your web app config into a{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">.env</code> file (see{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">.env.example</code>).
              </li>
              <li>
                Run <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">firebase init hosting</code> and{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">firebase deploy</code>.
              </li>
              <li>Your portfolio gets its unique URL on your Firebase Hosting domain, e.g. <em>yourproject.web.app/p/username</em>.</li>
            </ol>
            <p className="mt-3 text-xs font-semibold text-amber-600">Running on local demo backend</p>
          </>
        )}
      </SectionCard>
    </div>
  )
}
