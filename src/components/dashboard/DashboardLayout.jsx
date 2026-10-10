import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'

const NAV = [
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
  { to: '/dashboard/skills', label: 'Skills matrix', icon: '🧩' },
  { to: '/dashboard/projects', label: 'Projects', icon: '⭐' },
  { to: '/dashboard/blog', label: 'Blog', icon: '📝' },
  { to: '/dashboard/inbox', label: 'Contact inbox', icon: '✉️' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { to: '/dashboard/publish', label: 'Publish', icon: '🚀' },
]

export default function DashboardLayout({ children }) {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <Link to="/" className="flex items-center gap-2 px-5 py-5 text-lg font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">P</span>
          PortfolioHub
        </Link>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          {profile?.username && (
            <Link
              to={`/p/${profile.username}`}
              className="mb-2 block truncate rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
            >
              View public page →
            </Link>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
              {(user?.displayName || user?.email || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-800">
                {user?.displayName || user?.email}
              </div>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="rounded-md px-1.5 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
