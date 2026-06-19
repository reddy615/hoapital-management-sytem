import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const success = await login(email, password)
    setLoading(false)

    if (success) {
      toast.success('Login successful!')
      setTimeout(() => navigate('/'), 500)
    }
  }

  const handleDemoLogin = async (demoEmail, demoPassword, role) => {
    setLoading(true)
    setEmail(demoEmail)
    setPassword(demoPassword)
    
    const success = await login(demoEmail, demoPassword)
    setLoading(false)

    if (success) {
      toast.success(`Logged in as ${role}`)
      setTimeout(() => navigate('/'), 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Hospital Management</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">Demo Accounts</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@hospital.com', 'admin@123', 'Admin')}
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('doctor@hospital.com', 'doctor@123', 'Doctor')}
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition disabled:opacity-50"
            >
              Doctor Login
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('patient@hospital.com', 'patient@123', 'Patient')}
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition disabled:opacity-50"
            >
              Patient Login
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-700">
              <strong>Demo Credentials:</strong><br/>
              Admin: admin@hospital.com<br/>
              Doctor: doctor@hospital.com<br/>
              Patient: patient@hospital.com<br/>
              Password: (respective)@123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
