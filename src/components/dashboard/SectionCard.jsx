export default function SectionCard({ title, description, action, children }) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export function SaveStatus({ state }) {
  // state: 'idle' | 'saving' | 'saved' | 'error'
  if (state === 'saving') return <span className="text-xs font-medium text-slate-400">Saving…</span>
  if (state === 'saved') return <span className="text-xs font-medium text-emerald-600">Saved ✓</span>
  if (state === 'error') return <span className="text-xs font-medium text-red-600">Couldn't save</span>
  return null
}
