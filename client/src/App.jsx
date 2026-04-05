import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Swipe from './pages/Swipe'
import Matches from './pages/Matches'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import AdminReports from './pages/AdminReports'

const AUTHED_ROUTES = [
  '/events', '/matches', '/profile', '/admin',
]

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<Landing />} />
      <Route path="/signup"         element={<SignUp />} />

      <Route path="/events"         element={<Layout><Events /></Layout>} />
      <Route path="/events/:id"     element={<Layout><EventDetail /></Layout>} />
      <Route path="/events/:id/swipe" element={<Layout><Swipe /></Layout>} />

      <Route path="/matches"        element={<Layout><Matches /></Layout>} />
      <Route path="/matches/:id/chat" element={<Layout><Chat /></Layout>} />

      <Route path="/profile"        element={<Layout><Profile /></Layout>} />
      <Route path="/profile/edit"   element={<Layout><EditProfile /></Layout>} />

      <Route path="/admin/reports"  element={<Layout><AdminReports /></Layout>} />

      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}
