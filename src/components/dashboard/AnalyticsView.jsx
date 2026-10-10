import { useEffect, useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { getAnalyticsSummary } from '../../lib/analytics'
import SectionCard from './SectionCard'
import MiniLineChart from './MiniLineChart'

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</div>
    </div>
  )
}

export default function AnalyticsView() {
  const { profile } = useProfile()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (!profile?.username) return
    getAnalyticsSummary(profile.username).then(setSummary)
  }, [profile?.username])

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-900">Analytics</h1>

      {!profile?.published && (
        <div className="mb-5 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Your portfolio isn't published yet — publish it to start collecting real visitor data.
        </div>
      )}

      {!summary ? (
        <p className="text-sm text-slate-400">Loading analytics…</p>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Total views" value={summary.totalViews} />
            <StatTile label="Unique visitors" value={summary.uniqueVisitors} />
            <StatTile label="Portfolio views" value={summary.portfolioViews} />
            <StatTile label="Post views" value={summary.postViews} />
          </div>

          <SectionCard title="Views, last 14 days">
            {summary.totalViews === 0 ? (
              <p className="text-sm text-slate-400">No views logged yet.</p>
            ) : (
              <MiniLineChart data={summary.trend} />
            )}
          </SectionCard>

          <SectionCard title="Top posts">
            {summary.topPosts.length === 0 ? (
              <p className="text-sm text-slate-400">No post views yet.</p>
            ) : (
              <div className="space-y-2">
                {summary.topPosts.map((p) => {
                  const max = summary.topPosts[0].views
                  return (
                    <div key={p.postId} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 truncate text-sm text-slate-700">{p.title}</span>
                      <div className="h-2 flex-1 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${(p.views / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-slate-500">
                        {p.views}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  )
}
