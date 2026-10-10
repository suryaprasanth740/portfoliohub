import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProfileEditor from '../components/dashboard/ProfileEditor'
import SkillsMatrixEditor from '../components/dashboard/SkillsMatrixEditor'
import ProjectsEditor from '../components/dashboard/ProjectsEditor'
import BlogEditor from '../components/dashboard/BlogEditor'
import BlogPostForm from '../components/dashboard/BlogPostForm'
import ContactInbox from '../components/dashboard/ContactInbox'
import AnalyticsView from '../components/dashboard/AnalyticsView'
import PublishPanel from '../components/dashboard/PublishPanel'
import { useProfile } from '../context/ProfileContext'

export default function Dashboard() {
  const { loading } = useProfile()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">Loading your workspace…</div>
    )
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="skills" element={<SkillsMatrixEditor />} />
        <Route path="projects" element={<ProjectsEditor />} />
        <Route path="blog" element={<BlogEditor />} />
        <Route path="blog/new" element={<BlogPostForm />} />
        <Route path="blog/:postId" element={<BlogPostForm />} />
        <Route path="inbox" element={<ContactInbox />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="publish" element={<PublishPanel />} />
      </Routes>
    </DashboardLayout>
  )
}
