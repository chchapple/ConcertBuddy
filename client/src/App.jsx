import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar        from './components/Navbar.jsx'
import Landing       from './pages/Landing.jsx'
import SignUp        from './pages/SignUp.jsx'
import SignIn        from './pages/SignIn.jsx'
import Events        from './pages/Events.jsx'
import EventDetail   from './pages/EventDetail.jsx'
import Swipe         from './pages/Swipe.jsx'
import CardStack     from './pages/CardStack.jsx'
import Matches       from './pages/Matches.jsx'
import Chat          from './pages/Chat.jsx'
import Profile       from './pages/Profile.jsx'
import EditProfile   from './pages/EditProfile.jsx'
import AdminReports  from './pages/AdminReports.jsx'

function Layout() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  )
}

function ProtectedLayout() {
  const { session, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading…</div>
  if (!session) return <Navigate to="/signin" replace />
  return <Layout />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<Landing />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/events"               element={<Events />} />
        <Route path="/events/:id"           element={<EventDetail />} />
        <Route path="/events/:id/swipe"     element={<Swipe />} />
        <Route path="/stack"                element={<CardStack />} />
        <Route path="/messages"             element={<Matches />} />
        <Route path="/messages/:id/chat"    element={<Chat />} />
        <Route path="/matches/:id/chat"     element={<Chat />} />
        <Route path="/profile"              element={<Profile />} />
        <Route path="/profile/edit"         element={<EditProfile />} />
        <Route path="/admin"                element={<AdminReports />} />
        <Route path="/admin/reports"        element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
