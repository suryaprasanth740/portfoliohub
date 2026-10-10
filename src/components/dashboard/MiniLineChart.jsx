import { useId, useState } from 'react'

/**
 * A small, dependency-free line chart for the 14-day views trend.
 * Single series, one axis, thin rounded-cap stroke, recessive gridlines,
 * hover crosshair + tooltip — per the dataviz skill's mark/interaction specs.
 */
export default function MiniLineChart({ data }) {
  const gradientId = useId()
  const [hoverIdx, setHoverIdx] = useState(null)

  const width = 640
  const height = 180
  const padding = { top: 16, right: 12, bottom: 24, left: 12 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const max = Math.max(1, ...data.map((d) => d.count))
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0

  const points = data.map((d, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + innerH - (d.count / max) * innerH,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${padding.top + innerH} L ${points[0]?.x ?? 0} ${padding.top + innerH} Z`

  const hovered = hoverIdx !== null ? points[hoverIdx] : null

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * width
    let closest = 0
    let closestDist = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setHoverIdx(closest)
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Recessive horizontal gridlines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - f)}
            y2={padding.top + innerH * (1 - f)}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={padding.top}
              y2={padding.top + innerH}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={hovered.x} cy={hovered.y} r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
          </>
        )}

        {/* First/last date labels */}
        <text x={padding.left} y={height - 6} fontSize="10" fill="#94a3b8">
          {data[0]?.date?.slice(5)}
        </text>
        <text x={width - padding.right} y={height - 6} fontSize="10" fill="#94a3b8" textAnchor="end">
          {data[data.length - 1]?.date?.slice(5)}
        </text>
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow"
          style={{ left: `${(hovered.x / width) * 100}%`, top: `${(hovered.y / height) * 100}%` }}
        >
          <div className="font-semibold tabular-nums">{hovered.count} views</div>
          <div className="text-[10px] text-slate-300">{hovered.date}</div>
        </div>
      )}
    </div>
  )
}
