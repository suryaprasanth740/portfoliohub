// Alternate entry point used only for the single-file Artifact deploy build
// (npm run build:artifact). Identical to main.jsx except it uses
// MemoryRouter: a published Artifact is one static document with no server
// to resolve paths like /p/username, and the platform only lets a plain
// #token (no slashes) survive in the URL — so in-app navigation (Login,
// Dashboard tabs, viewing a portfolio) is kept entirely in memory instead of
// the address bar. Every Link/useNavigate/useParams call in the app works
// unchanged; only the router implementation differs.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { seedDemoData } from './data/seed.js'

seedDemoData()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </AuthProvider>
    </MemoryRouter>
  </StrictMode>
)
