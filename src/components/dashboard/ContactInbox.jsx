import { useEffect, useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { deleteDoc, listDocs, updateDoc } from '../../lib/db'

export default function ContactInbox() {
  const { profile } = useProfile()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!profile?.username) return
    setLoading(true)
    const list = await listDocs('messages', { toUsername: profile.username })
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setMessages(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.username])

  async function toggleRead(msg) {
    const updated = await updateDoc('messages', msg.id, { read: !msg.read })
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, ...updated } : m)))
  }

  async function remove(id) {
    await deleteDoc('messages', id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Contact inbox</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {unreadCount} unread
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading messages…</p>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">
          No messages yet. Messages sent through your portfolio's contact form will show up here.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border bg-white p-4 shadow-sm ${
                m.read ? 'border-slate-200' : 'border-indigo-200 bg-indigo-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{m.name}</div>
                  <a href={`mailto:${m.email}`} className="text-xs text-indigo-600 hover:underline">
                    {m.email}
                  </a>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs">
                  <span className="text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <button
                    onClick={() => toggleRead(m)}
                    className="rounded-md border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
                  >
                    {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button onClick={() => remove(m.id)} className="px-1 text-slate-300 hover:text-red-500">
                    ✕
                  </button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
