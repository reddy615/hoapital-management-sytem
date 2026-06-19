import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this resource</p>
          <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go Back Home
          </a>
        </div>
      </div>
    )
  }

  return children
}
