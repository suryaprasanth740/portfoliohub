import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDoc, listDocs } from '../lib/db'
import { getTheme, themeToCssVars } from '../data/themes'
import { trackView } from '../lib/analytics'
import { useAuth } from '../context/AuthContext'
import HeroSection from '../components/portfolio/HeroSection'
import PublicNav from '../components/portfolio/PublicNav'
import SkillsMatrix from '../components/portfolio/SkillsMatrix'
import ProjectsShowcase from '../components/portfolio/ProjectsShowcase'
import BlogList from '../components/portfolio/BlogList'
import ContactForm from '../components/portfolio/ContactForm'
import PdfExportButton from '../components/portfolio/PdfExportButton'
import NotFound from './NotFound'

export default function PublicPortfolio() {
  const { username } = useParams()
  const { user } = useAuth()
  const [state, setState] = useState({ loading: true, profile: null, projects: [], posts: [], error: false })
  const pageRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // Firestore security rules can't verify an unfiltered query against a
        // rule like "published == true || owner", so the query itself must
        // ask only for published profiles. An owner previewing their own
        // still-unpublished portfolio is fetched separately by uid, which
        // Firestore rules can check against the real document.
        const published = await listDocs('profiles', { username, published: true })
        let profile = published[0] || null

        if (!profile && user) {
          const own = await getDoc('profiles', user.uid)
          if (own && own.username === username) profile = own
        }

        if (!profile) {
          if (!cancelled) setState({ loading: false, profile: null, projects: [], posts: [], error: false })
          return
        }

        const isOwner = user?.uid === profile.id
        const [projects, posts] = await Promise.all([
          listDocs('projects', { authorId: profile.id }),
          // Same reasoning as above: a non-owner's query has to filter by
          // status itself, since the rule can't be proven for an unfiltered
          // list of someone else's posts.
          isOwner
            ? listDocs('posts', { authorId: profile.id })
            : listDocs('posts', { authorId: profile.id, status: 'published' }),
        ])
        if (!cancelled) setState({ loading: false, profile, projects, posts, error: false })
        if (profile.published) trackView(username, { type: 'portfolio' })
      } catch (err) {
        console.error('Failed to load public portfolio:', err)
        if (!cancelled) setState({ loading: false, profile: null, projects: [], posts: [], error: true })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username, user])

  if (state.loading) return null
  if (!state.profile) return <NotFound />

  const isOwner = user?.uid === state.profile.id

  if (!state.profile.published && !isOwner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-50 text-center">
        <div className="text-5xl">🚧</div>
        <h1 className="text-xl font-bold text-slate-800">This portfolio isn't published yet</h1>
        <p className="text-slate-500">Check back later.</p>
      </div>
    )
  }

  const theme = getTheme(state.profile.theme)

  const sections = [
    { id: 'skills', label: 'Skills', show: state.profile.skills?.length > 0 },
    { id: 'projects', label: 'Projects', show: state.projects.length > 0 },
    { id: 'blog', label: 'Blog', show: state.posts.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ].filter((s) => s.show)

  return (
    <div style={{ ...themeToCssVars(theme), background: 'var(--ph-bg)' }} className="min-h-screen">
      {!state.profile.published && isOwner && (
        <div className="bg-amber-500 py-2 text-center text-sm font-medium text-white">
          Preview mode — only you can see this. <Link to="/dashboard/publish" className="underline">Publish it</Link> to share.
        </div>
      )}

      <div ref={pageRef}>
        <HeroSection
          profile={state.profile}
          pdfButton={<PdfExportButton targetRef={pageRef} filename={`${state.profile.username}-portfolio.pdf`} />}
        />
        <PublicNav sections={sections} />
        <SkillsMatrix skills={state.profile.skills} />
        <ProjectsShowcase projects={state.projects} />
        <BlogList posts={state.posts} username={username} />
        <ContactForm username={username} />
      </div>

      <footer className="px-6 py-8 text-center text-xs" style={{ color: 'var(--ph-muted)' }}>
        Built with PortfolioHub
      </footer>
    </div>
  )
}
