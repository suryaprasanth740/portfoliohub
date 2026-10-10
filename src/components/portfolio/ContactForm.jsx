import { useState } from 'react'
import { addDoc } from '../../lib/db'

export default function ContactForm({ username }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await addDoc('messages', {
        toUsername: username,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        read: false,
      })
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-14">
      <h2 className="mb-2 text-2xl font-bold" style={{ color: 'var(--ph-text)' }}>
        Get in touch
      </h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--ph-muted)' }}>
        Have a role, a project, or just want to say hi? Send a message below.
      </p>

      {status === 'sent' ? (
        <div
          className="rounded-xl border p-6 text-center"
          style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-surface)' }}
        >
          <div className="mb-1 text-2xl">✅</div>
          <p className="font-medium" style={{ color: 'var(--ph-text)' }}>
            Thanks — your message is on its way.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-3 text-sm underline"
            style={{ color: 'var(--ph-primary)' }}
          >
            Send another
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-xl border p-5"
          style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-surface)' }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Your name"
              className="rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-bg)', color: 'var(--ph-text)' }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Your email"
              className="rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-bg)', color: 'var(--ph-text)' }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <textarea
            required
            rows={4}
            placeholder="Your message"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-bg)', color: 'var(--ph-text)' }}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {status === 'error' && <p className="text-sm text-red-500">Couldn't send — try again.</p>}
          <button
            disabled={status === 'sending'}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'var(--ph-primary)' }}
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </section>
  )
}
