import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Code-split the heavier routes (Markdown editor, PDF export, charts) so the
// landing and login pages stay fast to first paint.
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio'))
const PublicPostDetail = lazy(() => import('./pages/PublicPostDetail'))

function RouteFallback() {
  return <div className="flex h-screen items-center justify-center text-slate-400">Loading…</div>
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/p/:username" element={<PublicPortfolio />} />
        <Route path="/p/:username/blog/:slug" element={<PublicPostDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
