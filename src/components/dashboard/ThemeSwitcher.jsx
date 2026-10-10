import { THEMES } from '../../data/themes'

export default function ThemeSwitcher({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {THEMES.map((t) => {
        const active = value === t.id
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-xl border p-2 text-left transition ${
              active ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className="mb-2 h-10 w-full rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.accent})`,
              }}
            />
            <div className="text-xs font-medium text-slate-700">{t.name}</div>
          </button>
        )
      })}
    </div>
  )
}
