# Authentication and RBAC Code Audit Report

Date: 2026-06-19

Scope: Existing Authentication and RBAC stabilization only. No new product features were added.

## Executive Summary

The audit found critical issues in public role assignment, token refresh handling, frontend auth state consistency, route protection, and stale API contracts. The confirmed auth/RBAC issues were fixed in place. The largest behavior change is intentional: public registration can now create only patient accounts, and all JWTs must carry an explicit token type.

## Issues Fixed

### 1. Security Vulnerabilities

- Blocked public self-registration as `admin`, `doctor`, or `receptionist`.
- Required explicit `access` token type for protected routes and explicit `refresh` token type for refresh.
- Added a separate refresh-token secret config value with fallback to the existing JWT secret.
- Rejected tokens for deleted/deactivated users on protected routes and refresh.
- Rejected access and refresh tokens issued before the user's latest password change.
- Changed forgot-password responses to avoid leaking whether an email exists or belongs to an active account.
- Added strict Bearer header validation.
- Limited pagination values for admin user listing.

### 2. Missing Imports

- Fixed `refreshToken` controller runtime failure by importing and using `generateRefreshToken`.
- Removed stale unused imports for `jwt`, `AppError`, and `generateVerificationToken`.

### 3. Circular Dependencies

- Rechecked auth service, API client, auth store, routes, middleware, and controllers.
- No circular dependency remains in the auth path. The API client imports the auth store directly, while the store has no API dependency.

### 4. Unused Code

- Removed unused auth token helper exports from `tokenUtils.js`.
- Removed duplicate JWT helpers from `helpers.js`.
- Removed unused `AppError` export.
- Removed unused duplicate `frontend/src/services/authService.js`.
- Removed an unused `useState` import in `PatientDashboard.jsx`.

### 5. API Inconsistencies

- Fixed frontend reads of backend auth responses from `response.data.data`.
- Fixed registration to send `confirmPassword`.
- Standardized refresh response handling to store both `accessToken` and rotated `refreshToken`.
- Kept user list output sanitized with `toJSON()`.

### 6. React Rendering and State Issues

- Replaced isolated local auth hook state with the existing shared Zustand store.
- Added route guard loading handling.
- Updated profile changes to refresh shared auth state, not just localStorage.
- Replaced a full-page reload link in the RBAC denial view with a router `Link`.
- Fixed stale toast error state in forgot-password.
- Added reset-token presence validation in reset-password.

### 7. Memory Leaks and Cleanup

- Kept auth state in one store instead of several hook-local copies.
- Added single-flight refresh handling so concurrent 401 responses share one refresh request.
- Verified `useFetch` already cancels state writes after unmount.

### 8. Route Protection

- Applied backend `authorize` middleware to protected route groups.
- Aligned frontend protected routes and sidebar navigation with backend role access.
- Kept `/auth/users` and `/auth/users/:id` admin-only.

### 9. Token Refresh Bugs

- Fixed missing refresh-token generation import.
- Prevented access tokens from being used as refresh tokens.
- Rotated refresh tokens on refresh.
- Retried failed API requests once after a successful refresh.
- Cleared all auth state only after refresh fails.

### 10. MongoDB Schema Issues

- Removed duplicate explicit `createdAt` and `updatedAt` fields because `timestamps: true` already manages them.
- Removed duplicate manual email index while keeping `unique: true`.
- Added trim/lowercase consistency for auth fields.
- Added sparse indexes for password reset and email verification token lookups.

## Files Changed

- Backend auth/RBAC: `authController.js`, `auth.js` middleware, `tokenUtils.js`, `validation.js`, `User.js`, `server.js`, `env.js`, `errors.js`, `helpers.js`
- Frontend auth/RBAC: `authStore.js`, `useAuth.js`, `api.js`, `ProtectedRoute.jsx`, `RoleBasedRoute.jsx`, `App.jsx`, `Layout.jsx`, `Register.jsx`, `Profile.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`
- Removed duplicate frontend service: `frontend/src/services/authService.js`

## Verification

Passed:

- `node --check` on changed backend/auth JavaScript files.
- `node --check` on changed plain frontend JavaScript files.
- `esbuild` parser checks on changed JSX files.
- Static searches for stale auth imports, removed helper names, stale response-shape reads, and direct auth anchor reloads.

Blocked or outside scope:

- `npm.cmd run build` reaches Vite, but fails on existing frontend config: `postcss.config.js` uses `module.exports` while `frontend/package.json` declares `"type": "module"`.
- `npm.cmd run lint` cannot run because the frontend has no ESLint config file.
- `npm install --package-lock=false` reported 7 installed dependency vulnerabilities; no force upgrade was run because that would change dependency versions outside this auth stabilization.

## Residual Notes

- Existing logout remains stateless; true server-side token revocation would require session storage or a token denylist.
- Backend route-group RBAC is enforced, but fine-grained record ownership filtering belongs to the domain route handlers and should be handled separately if patients/doctors need self-service access to only their own records.
