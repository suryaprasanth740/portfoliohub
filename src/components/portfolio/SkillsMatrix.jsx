export default function SkillsMatrix({ skills }) {
  if (!skills || skills.length === 0) return null
  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <section id="skills" className="mx-auto max-w-4xl px-6 py-14">
      <h2 className="mb-6 text-2xl font-bold" style={{ color: 'var(--ph-text)' }}>
        Skills
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat}
            className="rounded-xl border p-4"
            style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-surface)' }}
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--ph-muted)' }}>
              {cat}
            </h3>
            <div className="space-y-2.5">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <div key={s.id}>
                    <div className="mb-1 flex justify-between text-sm" style={{ color: 'var(--ph-text)' }}>
                      <span>{s.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            background: i <= s.level ? 'var(--ph-primary)' : 'var(--ph-surface-alt)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
