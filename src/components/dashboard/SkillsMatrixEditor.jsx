import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import SectionCard, { SaveStatus } from './SectionCard'

const LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Familiar' },
  { value: 3, label: 'Proficient' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function SkillsMatrixEditor() {
  const { profile, saveProfile } = useProfile()
  const [skills, setSkills] = useState([])
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [level, setLevel] = useState(3)
  const [status, setStatus] = useState('idle')
  const initialized = useRef(false)

  useEffect(() => {
    setSkills(profile?.skills || [])
    initialized.current = false
  }, [profile?.id])

  const categories = [...new Set(skills.map((s) => s.category))]

  function addSkill(e) {
    e.preventDefault()
    if (!name.trim() || !category.trim()) return
    setSkills((prev) => [...prev, { id: uid(), category: category.trim(), name: name.trim(), level }])
    setName('')
  }

  function removeSkill(id) {
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  async function persist(next) {
    setStatus('saving')
    try {
      await saveProfile({ skills: next })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1500)
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }
    const timeout = setTimeout(() => persist(skills), 500)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Skills matrix</h1>
        <SaveStatus state={status} />
      </div>

      <SectionCard title="Add a skill" description="Group related skills under a category, e.g. 'Languages' or 'Frameworks'.">
        <form onSubmit={addSkill} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_140px_auto]">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Category (e.g. Languages)"
            list="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Skill (e.g. JavaScript)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Add
          </button>
        </form>
      </SectionCard>

      {categories.length === 0 ? (
        <p className="text-sm text-slate-400">No skills yet — add your first one above.</p>
      ) : (
        categories.map((cat) => (
          <SectionCard key={cat} title={cat}>
            <div className="space-y-2">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-sm font-medium text-slate-800">{s.name}</span>
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`h-2 flex-1 rounded-full ${i <= s.level ? 'bg-indigo-500' : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="w-20 shrink-0 text-right text-xs text-slate-400">
                      {LEVELS.find((l) => l.value === s.level)?.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSkill(s.id)}
                      className="text-xs text-slate-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </SectionCard>
        ))
      )}
    </div>
  )
}
