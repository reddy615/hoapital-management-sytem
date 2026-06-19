# Quick Start Guide - Authentication System

## Environment Setup

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development

# Email Configuration (for forgot password)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173

# Cloudinary (for avatar upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini API (for AI features)
GEMINI_API_KEY=your_gemini_key
```

### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Starting the Application

### Development Mode
```bash
# From project root
npm run dev

# This starts both frontend (5173) and backend (5000)
```

### Frontend Only
```bash
cd frontend
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

## Test the Authentication

### Using Demo Accounts

1. **Navigate to Login Page**: http://localhost:5173/login

2. **Click Demo Account Button** or manually enter:

#### Admin Account
- Email: `admin@hospital.com`
- Password: `admin@123`

#### Doctor Account
- Email: `doctor@hospital.com`
- Password: `doctor@123`

#### Patient Account
- Email: `patient@hospital.com`
- Password: `patient@123`

#### Receptionist Account
- Email: `receptionist@hospital.com`
- Password: `receptionist@123`

### Register New User

1. Click "Register here" link on login page
2. Fill in details (min 3 chars name, valid email, 8+ char password)
3. Select role (Patient, Doctor, Admin, Receptionist)
4. Confirm password matches
5. Click "Create Account"
6. Automatically logged in and redirected to dashboard

## Using in Your Components

### Check Authentication Status
```jsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <p>Please login first</p>
  }
  
  return <p>Welcome {user.name} ({user.role})</p>
}
```

### Perform Authentication Operations
```jsx
import { useAuth } from './hooks/useAuth'

function AuthComponent() {
  const { login, register, logout, updateProfile } = useAuth()
  
  const handleLogin = async () => {
    const success = await login('user@hospital.com', 'password@123')
    // success = true if login successful
  }
  
  const handleRegister = async () => {
    const success = await register({
      name: 'John Doe',
      email: 'john@hospital.com',
      password: 'secure@123',
      role: 'patient'
    })
  }
  
  const handleLogout = () => {
    logout() // Clears tokens and redirects to login
  }
  
  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      name: 'Jane Doe',
      phone: '9876543210'
    })
  }
}
```

### Protect Routes
```jsx
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRoute from './components/RoleBasedRoute'

// Require authentication only
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Require specific role
<RoleBasedRoute allowedRoles={['admin', 'doctor']}>
  <AdminPanel />
</RoleBasedRoute>
```

## API Integration Examples

### Login API Call
```javascript
import { authService } from './services'

const response = await authService.login({
  email: 'user@hospital.com',
  password: 'password@123'
})

// Response structure:
{
  success: true,
  message: 'Login successful',
  data: {
    user: {
      _id: '...',
      name: 'John Doe',
      email: 'john@hospital.com',
      role: 'patient'
    },
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGc...',
    refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGc...'
  }
}
```

### Update Profile API Call
```javascript
import { authService } from './services'

const response = await authService.updateProfile({
  name: 'Jane Doe',
  phone: '9876543210',
  avatar: 'https://cloudinary.url/image.jpg'
})

// Response structure:
{
  success: true,
  message: 'Profile updated successfully',
  data: {
    user: { ...updated user object }
  }
}
```

### Change Password API Call
```javascript
import { authService } from './services'

const response = await authService.changePassword({
  oldPassword: 'current@123',
  newPassword: 'new@123',
  confirmPassword: 'new@123'
})

// Response structure:
{
  success: true,
  message: 'Password changed successfully'
}
```

## Frontend Routing

### Available Routes

**Public Routes:**
- `/login` - Login page
- `/register` - Register new account
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Complete password reset

**Protected Routes:**
- `/` - Dashboard (any authenticated user)
- `/profile` - User profile management
- `/appointments` - Appointment management
- `/consultations` - Consultation records
- `/prescriptions` - Prescription management
- `/billing` - Billing information
- `/reports` - System reports

**Role-Based Routes:**
- `/patient/*` - Patient dashboard (role: patient)
- `/doctor/*` - Doctor dashboard (role: doctor)
- `/admin/*` - Admin dashboard (role: admin)
- `/receptionist/*` - Receptionist dashboard (role: receptionist)

## Using with Other Modules

### Creating an Appointment (requires auth)
```jsx
import { appointmentService } from './services'
import { useAuth } from './hooks/useAuth'

function BookAppointment() {
  const { user } = useAuth() // Get logged-in user
  
  const handleBook = async () => {
    const appointment = await appointmentService.create({
      patientId: user._id,
      doctorId: 'doctor_id',
      date: '2024-01-15',
      reason: 'Checkup'
    })
  }
}
```

### Fetching Patient-Specific Data
```jsx
import { useAuth } from './hooks/useAuth'
import { useEffect, useState } from 'react'

function PatientData() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  
  useEffect(() => {
    if (user?.role === 'patient') {
      // Fetch patient-specific data
      // API will use JWT token automatically
    }
  }, [user])
}
```

## Troubleshooting

### Token Expiry
- Access tokens expire after 7 days
- Use refresh token endpoint to get new access token
- Frontend will automatically redirect to login if token invalid

### Invalid Credentials
- Check email is registered and spelled correctly
- Verify password is correct (case-sensitive)
- Look for account lock (2-hour lock after 5 failed attempts)

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Frontend should use VITE_API_URL env variable

### Email Not Sent
- Verify Nodemailer configuration in backend
- Check Gmail app password is correct (not account password)
- Enable "Less secure app access" in Gmail settings

### Avatar Upload Failed
- Verify Cloudinary credentials
- Check image file size (< 5MB recommended)
- Ensure image format is jpg/png/gif

## Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Use HTTPS in production** - Install SSL certificate
3. **Change JWT_SECRET** - Use a strong random string
4. **Implement rate limiting** - Protect login endpoint
5. **Clear cookies on logout** - Already implemented
6. **Validate on backend** - Never trust frontend validation alone
7. **Log authentication events** - Track failed login attempts
8. **Keep dependencies updated** - Run npm audit regularly

## Performance Optimization

### Token Caching
- Tokens stored in localStorage
- Tokens automatically sent with API requests
- Auto-refresh on expiry (with refreshToken endpoint)

### Component Optimization
- useAuth hook uses React.useCallback for performance
- Protected routes wrapped with lazy loading available
- Profile page optimized with useState for local changes

### Database Queries
- Indexes on email, role, createdAt for fast lookups
- Password not selected by default (reduces data transfer)
- Use pagination for user list (admin)

## Documentation Links

- [Complete API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Authentication Details](./AUTHENTICATION.md)

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
