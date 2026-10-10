import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '🎨', title: 'Theme it your way', body: 'Six curated color themes, applied instantly across your whole portfolio.' },
  { icon: '🧩', title: 'Skills matrix', body: 'Group skills by category and show proficiency at a glance.' },
  { icon: '⭐', title: 'Live GitHub stars', body: 'Your project showcase pulls real star counts straight from the GitHub API.' },
  { icon: '📝', title: 'Markdown blog', body: 'Write devlogs in a split-pane Markdown editor with syntax-highlighted code blocks.' },
  { icon: '✉️', title: 'Contact inbox', body: 'Visitors reach you through a contact form that lands right in your dashboard.' },
  { icon: '📈', title: 'Visitor analytics', body: 'See how many people are viewing your portfolio and which posts land best.' },
  { icon: '📄', title: 'One-click PDF', body: 'Export your live portfolio as a polished PDF for job applications.' },
  { icon: '🚀', title: 'Shareable URL', body: 'Publish to a unique portfoliohub.dev/p/yourname link in one click.' },
]

const STEPS = [
  { n: '01', title: 'Fill in your profile', body: 'Add your bio, skills, and links from a single dashboard form.' },
  { n: '02', title: 'Pick a theme', body: 'Choose one of six palettes — it applies instantly, no rebuild needed.' },
  { n: '03', title: 'Publish your link', body: 'Share one URL on your resume, LinkedIn, and job applications.' },
]

// A restrained, professional trio — cycled — instead of a rainbow per tile.
const ICON_TILES = [
  'from-indigo-500 to-violet-600',
  'from-slate-700 to-slate-900',
  'from-amber-500 to-amber-600',
]

export default function Home() {
  const { user } = useAuth()
  const primaryHref = user ? '/dashboard' : '/login'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky header — deep navy, matches the hero it sits on */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1220]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 text-lg font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-white shadow-sm shadow-indigo-900/60">
              P
            </span>
            PortfolioHub
          </div>
          <Link
            to={primaryHref}
            className="rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 px-4 py-2 text-sm font-semibold text-[#241a02] shadow-sm transition hover:brightness-105 hover:shadow-md"
          >
            {user ? 'Go to dashboard' : 'Sign in'}
          </Link>
        </div>
      </header>

      {/* Hero — deep navy background, indigo + gold glow, fine dot grid */}
      <section className="ph-landing-bg overflow-hidden bg-[#0b1220]">
        <span className="ph-blob h-80 w-80 bg-indigo-500/35" style={{ left: '-8%', top: '-10%' }} aria-hidden="true" />
        <span
          className="ph-blob h-64 w-64 bg-amber-400/20"
          style={{ right: '-4%', top: '14%', animationDelay: '-6s' }}
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-3 py-1 text-xs font-medium text-amber-200 shadow-sm backdrop-blur-sm lg:mx-0"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Live in minutes, not weekends
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="font-display mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
            >
              Build a developer portfolio that gets you hired.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0"
            >
              Configure your profile, showcase projects with live GitHub stars, write devlogs in
              Markdown, and publish to a shareable link — all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <Link
                to={primaryHref}
                className="rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 px-6 py-3 font-semibold text-[#241a02] shadow-lg shadow-amber-900/40 transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-xl"
              >
                Start building — it's free
              </Link>
              <a
                href="#features"
                className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
              >
                See what's included
              </a>
            </motion.div>
          </div>

          {/* Hero visual: a stylized preview of a published portfolio card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-transparent to-amber-400/20 blur-xl" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 truncate rounded-md bg-white px-2 py-0.5 text-[11px] text-slate-400">
                  portfoliohub.dev/p/surya
                </span>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 font-display text-sm font-semibold text-white">
                    SP
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">Surya Prasanth</div>
                    <div className="truncate text-xs text-indigo-600">Backend Engineer</div>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    Published
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Go', 'Postgres', 'Docker'].map((s) => (
                    <div key={s} className="rounded-lg bg-slate-50 px-2 py-2 text-center text-[11px] font-medium text-slate-600">
                      {s}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <span className="text-xs font-medium text-slate-700">order-service</span>
                    <span className="text-[11px] font-medium text-amber-500">⭐ 1.2k</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <span className="text-xs font-medium text-slate-700">rate-limiter-go</span>
                    <span className="text-[11px] font-medium text-amber-500">⭐ 640</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 pb-4 pt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative"
            >
              <div className="font-display text-3xl font-semibold text-indigo-200">{s.n}</div>
              <div className="mt-1 font-semibold text-slate-900">{s.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</div>
              {i < STEPS.length - 1 && (
                <span className="absolute right-[-14px] top-3 hidden text-slate-300 sm:block">→</span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-24 pt-16 scroll-mt-20">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Everything a portfolio needs, nothing it doesn't.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div
                className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${ICON_TILES[i % ICON_TILES.length]} text-lg shadow-sm`}
              >
                {f.icon}
              </div>
              <div className="mt-3 font-semibold text-slate-900">{f.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-slate-600">{f.body}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-display text-white">
              P
            </span>
            PortfolioHub
          </div>
          <div>Built for developers, by developers.</div>
        </div>
      </footer>
    </div>
  )
}
