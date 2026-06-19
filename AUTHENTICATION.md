# Authentication & Role-Based Access Control (RBAC) Implementation

This document outlines the complete Authentication and RBAC system implemented for the Hospital Management System.

## Overview

A production-ready authentication and authorization system built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Zustand
- **Security**: JWT + bcryptjs + Joi validation

## System Architecture

### Backend Stack

#### Models
- **User.js** - Enhanced schema with full authentication features
  - Email verification support
  - Password reset tokens
  - Login attempt tracking
  - Account locking mechanism (2-hour lock after 5 failed attempts)
  - Security methods: comparePassword, isAccountLocked, incLoginAttempts, resetLoginAttempts

#### Utilities
- **validation.js** - Joi schemas for all auth operations
  - Register, Login, UpdateProfile, ChangePassword, ForgotPassword, ResetPassword
  
- **errors.js** - Centralized error handling
  - Custom AppError class
  - 10+ predefined error messages
  - Standard HTTP status codes

- **tokenUtils.js** - JWT and token management
  - generateToken (7-day access token)
  - generateRefreshToken (30-day refresh token)
  - verifyToken with error distinction
  - Password reset tokens (30-minute expiry)
  - OTP generation
  - Email verification tokens

#### Controllers
- **authController.js** - 10 endpoint handlers
  - register - Create new user account
  - login - Authenticate and return tokens
  - logout - Clear session
  - getProfile - Fetch user details
  - updateProfile - Edit user information
  - changePassword - Update password with old password verification
  - forgotPassword - Initiate password reset flow
  - resetPassword - Complete password reset with token
  - refreshToken - Get new access token
  - getAllUsers (Admin) - List all users with pagination
  - deleteUser (Admin) - Remove user account

#### Routes
- **auth.js** - Configured routes with appropriate access controls
  - Public: /register, /login, /forgot-password, /reset-password, /refresh-token
  - Protected: /logout, /profile, /change-password
  - Admin-only: /users, /users/:id

#### Middleware
- **auth.js** - Enhanced middleware with three functions
  - authenticate - Verify JWT token
  - authorize - Check user role permissions
  - errorHandler - Centralized error handling
  - notFound - 404 handler

### Frontend Stack

#### Pages
- **Login.jsx** - Enhanced login page
  - Email/password input
  - Show/hide password toggle
  - Forgot password link
  - Register link
  - Demo account shortcuts
  - Loading states and validation

- **Register.jsx** - New user registration
  - Name, email, password, confirm password
  - Role selection (Patient, Doctor, Admin, Receptionist)
  - Client-side validation
  - Error display
  - Login redirect after success

- **ForgotPassword.jsx** - Password reset initiation
  - Email input
  - Confirmation message
  - Resend link functionality

- **ResetPassword.jsx** - Complete password reset
  - Token validation from URL
  - New password input
  - Password confirmation
  - Strong password requirements

- **Profile.jsx** - User profile management
  - Display user information
  - Edit profile (name, phone, avatar)
  - Change password with current password verification
  - Logout button
  - Account status display

#### Components
- **ProtectedRoute.jsx** - Wraps protected routes
  - Redirects unauthenticated users to login
  - Optional role-based access control

- **RoleBasedRoute.jsx** - Enforces role-based access
  - Checks user role against allowed roles
  - Shows access denied page if role mismatch

#### Hooks
- **useAuth.js** - Enhanced authentication hook with 11 methods
  - login
  - register
  - logout
  - updateProfile
  - changePassword
  - forgotPassword
  - resetPassword
  - refreshAuthToken
  - State: user, isAuthenticated, loading

#### Services
- **authService.js** - 11 API service methods
  - register
  - login
  - logout
  - getProfile
  - updateProfile
  - changePassword
  - forgotPassword
  - resetPassword
  - refreshToken
  - getAllUsers
  - deleteUser

#### Routing
- **App.jsx** - Updated with comprehensive routing
  - Public routes: /login, /register, /forgot-password, /reset-password/:token
  - Protected routes with ProtectedRoute wrapper
  - Role-based routes with RoleBasedRoute wrapper
  - Loading state during auth initialization

## Security Features

### Password Security
- Minimum 8 characters required
- Bcryptjs hashing with 10 salt rounds
- Password comparison without storing plaintext
- Old password verification on change
- Cannot reuse same password

### Account Protection
- Login attempt tracking
- Automatic lock after 5 failed attempts
- 2-hour lockout duration
- Auto-unlock when lock expires
- Lock reset on successful login

### Token Security
- JWT-based stateless authentication
- 7-day access token expiry
- 30-day refresh token expiry
- 30-minute password reset token expiry
- Token validation on every protected request
- Distinct error messages for expired vs invalid tokens

### Input Validation
- Joi schemas for all inputs
- Email format validation
- Password strength requirements
- Confirm password matching
- Phone number format validation
- Role enum validation

### Error Handling
- Standardized error responses
- No sensitive information in error messages
- Detailed logging in development
- Proper HTTP status codes

## Database Schema

### User Collection
```
{
  name: String (3-50 chars),
  email: String (unique, lowercase),
  password: String (hashed, select: false),
  role: String (enum: admin/doctor/patient/receptionist/staff),
  phone: String (10-15 digits),
  avatar: String (Cloudinary URL),
  isActive: Boolean,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  lastLogin: Date,
  lastPasswordChange: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- email (unique)
- role
- createdAt (descending)
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Create new user account
```
Request:
{
  name: "John Doe",
  email: "john@hospital.com",
  password: "secure@123",
  confirmPassword: "secure@123",
  role: "patient"
}

Response:
{
  success: true,
  message: "User registered successfully",
  data: {
    user: {...},
    accessToken: "...",
    refreshToken: "..."
  }
}
```

#### POST /auth/login
Authenticate user
```
Request:
{
  email: "john@hospital.com",
  password: "secure@123"
}

Response:
{
  success: true,
  message: "Login successful",
  data: {
    user: {...},
    accessToken: "...",
    refreshToken: "..."
  }
}
```

#### POST /auth/logout
End session (requires auth)
```
Response:
{
  success: true,
  message: "Logout successful"
}
```

#### GET /auth/profile
Get current user profile (requires auth)
```
Response:
{
  success: true,
  data: {
    user: {...}
  }
}
```

#### PUT /auth/profile
Update user profile (requires auth)
```
Request:
{
  name: "Jane Doe",
  phone: "9876543210",
  avatar: "https://..."
}

Response:
{
  success: true,
  message: "Profile updated successfully",
  data: {
    user: {...}
  }
}
```

#### PUT /auth/change-password
Change password (requires auth)
```
Request:
{
  oldPassword: "old@123",
  newPassword: "new@123",
  confirmPassword: "new@123"
}

Response:
{
  success: true,
  message: "Password changed successfully"
}
```

#### POST /auth/forgot-password
Request password reset
```
Request:
{
  email: "john@hospital.com"
}

Response:
{
  success: true,
  message: "Password reset link sent to your email"
}
```

#### POST /auth/reset-password
Complete password reset
```
Request:
{
  token: "reset_token",
  newPassword: "new@123",
  confirmPassword: "new@123"
}

Response:
{
  success: true,
  message: "Password reset successfully"
}
```

#### POST /auth/refresh-token
Get new access token
```
Request:
{
  refreshToken: "..."
}

Response:
{
  success: true,
  data: {
    accessToken: "..."
  }
}
```

#### GET /auth/users (Admin only)
List all users with pagination
```
Query: ?page=1&limit=10

Response:
{
  success: true,
  data: {
    users: [...],
    pagination: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10
    }
  }
}
```

#### DELETE /auth/users/:id (Admin only)
Delete user account
```
Response:
{
  success: true,
  message: "User deleted successfully"
}
```

## Role-Based Access Control

### Roles
1. **Admin** - Full system access, user management
2. **Doctor** - View patients, consultations, prescriptions
3. **Patient** - Book appointments, view consultations
4. **Receptionist** - Manage appointments, patient info
5. **Staff** - General support access

### Protected Routes
- Patient routes: `/patient/*`
- Doctor routes: `/doctor/*`
- Admin routes: `/admin/*`
- Receptionist routes: `/receptionist/*`

### Authorization Levels
- Public: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Authenticated: `/profile`, `/appointments`, `/consultations`
- Role-specific: `/admin/users`, `/doctor/patients`, etc.

## Usage Examples

### Frontend Login
```jsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { login, user, isAuthenticated } = useAuth()
  
  const handleLogin = async () => {
    const success = await login('user@hospital.com', 'password@123')
    if (success) {
      // User logged in
    }
  }
  
  return (
    <div>
      {isAuthenticated && <p>Welcome {user.name}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
```

### Protected Route
```jsx
<ProtectedRoute requiredRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

### API Call with Auth
```jsx
const { data } = await authService.updateProfile({
  name: 'New Name',
  phone: '9876543210'
})
```

## Testing Credentials

### Admin Account
- Email: admin@hospital.com
- Password: admin@123

### Doctor Account
- Email: doctor@hospital.com
- Password: doctor@123

### Patient Account
- Email: patient@hospital.com
- Password: patient@123

### Receptionist Account
- Email: receptionist@hospital.com
- Password: receptionist@123

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 400 | Validation error | Invalid input data |
| 401 | Invalid credentials | Wrong email/password |
| 401 | Token expired | Need to refresh token |
| 401 | Invalid token | Malformed or invalid token |
| 403 | Unauthorized | Insufficient permissions |
| 404 | User not found | User doesn't exist |
| 409 | Email already exists | Email is already registered |
| 500 | Internal server error | Server error |

## Integration with Other Modules

The authentication system integrates with:
- **Patient Management** - User is linked to patient records
- **Doctor Management** - User is linked to doctor profiles
- **Appointments** - Uses user for booking/scheduling
- **Consultations** - Records doctor-patient interactions
- **Billing** - Tracks charges by patient user

## Best Practices

1. **Never store passwords in plaintext**
2. **Always validate input on both frontend and backend**
3. **Use HTTPS in production**
4. **Implement rate limiting on login endpoint**
5. **Log authentication failures**
6. **Refresh tokens periodically**
7. **Clear tokens on logout**
8. **Use secure httpOnly cookies for tokens in production**

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, Facebook)
- [ ] Social login
- [ ] Email verification on signup
- [ ] Session management
- [ ] Device tracking
- [ ] Login history
- [ ] Account recovery questions
- [ ] Biometric authentication
- [ ] Role granularity (permissions vs roles)

---

**Version**: 1.0.0  
**Last Updated**: $(date)  
**Status**: Production Ready ✅
