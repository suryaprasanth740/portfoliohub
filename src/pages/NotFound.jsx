import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-500">That link doesn't lead anywhere on PortfolioHub.</p>
      <Link to="/" className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
        Go home
      </Link>
    </div>
  )
}
