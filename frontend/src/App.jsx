import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from './hooks/useAuth'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import Appointments from './pages/Appointments'
import Consultations from './pages/Consultations'
import Prescriptions from './pages/Prescriptions'
import Billing from './pages/Billing'
import Reports from './pages/Reports'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRoute from './components/RoleBasedRoute'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/*"
          element={
            <RoleBasedRoute allowedRoles={['patient']}>
              <Layout>
                <PatientDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/doctor/*"
          element={
            <RoleBasedRoute allowedRoles={['doctor']}>
              <Layout>
                <DoctorDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/receptionist/*"
          element={
            <RoleBasedRoute allowedRoles={['receptionist']}>
              <Layout>
                <ReceptionistDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultations"
          element={
            <ProtectedRoute>
              <Layout>
                <Consultations />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Layout>
                <Prescriptions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Layout>
                <Billing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
