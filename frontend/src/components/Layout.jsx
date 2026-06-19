import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">HMS</h1>
          <p className="text-sm text-gray-600">Hospital Management</p>
        </div>

        <nav className="mt-6">
          <NavLink to="/" icon="🏠" label="Dashboard" />
          <NavLink to="/appointments" icon="📅" label="Appointments" />
          <NavLink to="/consultations" icon="🩺" label="Consultations" />
          <NavLink to="/prescriptions" icon="💊" label="Prescriptions" />
          <NavLink to="/billing" icon="💳" label="Billing" />
          <NavLink to="/reports" icon="📊" label="Reports" />
          
          {user?.role === 'admin' && (
            <>
              <div className="px-6 py-2 mt-6 text-xs font-semibold text-gray-500 uppercase">
                Admin
              </div>
              <NavLink to="/admin" icon="⚙️" label="Admin Panel" />
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold text-gray-800">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-danger hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center px-6 py-3 text-gray-700 hover:bg-light hover:text-primary transition-colors"
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
