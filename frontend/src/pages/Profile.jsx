import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: ''
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const { data } = await authService.updateProfile(formData)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!passwordData.oldPassword) newErrors.oldPassword = 'Current password is required'
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required'
    if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters'
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await authService.changePassword(passwordData)
      toast.success('Password changed successfully!')
      setIsChangingPassword(false)
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={() => {
            logout()
            window.location.href = '/login'
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="space-y-4 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-15 digits"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-800">{user.phone || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium text-gray-800 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Security</h3>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                {errors.oldPassword && <p className="text-red-600 text-xs">{errors.oldPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                {errors.newPassword && <p className="text-red-600 text-xs">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {!isChangingPassword && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Last password change</p>
              <p className="font-medium text-gray-800">
                {user.lastPasswordChange ? new Date(user.lastPasswordChange).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
