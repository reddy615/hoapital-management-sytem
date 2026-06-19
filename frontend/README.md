# Hospital Management System - Frontend

React + Vite + Tailwind CSS

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Server

Frontend runs at: **http://localhost:5173**

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   │   └── Layout.jsx   # Main layout with sidebar
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ReceptionistDashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── Consultations.jsx
│   │   ├── Prescriptions.jsx
│   │   ├── Billing.jsx
│   │   └── Reports.jsx
│   ├── services/        # API calls
│   │   ├── api.js      # Axios configuration
│   │   └── index.js    # All services
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── context/        # Context/State management
│   │   └── authStore.js
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.local
```

## Environment Setup

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Available Scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Features

### Authentication
- Login/Logout
- Role-based access control
- Protected routes
- JWT token management

### Dashboards
- **Admin**: System overview, user management
- **Doctor**: Schedule, consultations, prescriptions
- **Patient**: Appointments, medical history, prescriptions
- **Receptionist**: Appointment queue, check-in/check-out

### Modules
- **Appointments**: Book, view, cancel appointments
- **Consultations**: Consultation history and notes
- **Prescriptions**: View and download prescriptions
- **Billing**: View bills and payment status
- **Reports**: Analytics and statistics

## Component Hierarchy

```
App
├── Login (public)
└── Protected Routes
    ├── Layout
    │   ├── Sidebar Navigation
    │   ├── Top Header
    │   └── Main Content Area
    │       ├── Dashboard
    │       ├── PatientDashboard
    │       ├── DoctorDashboard
    │       ├── AdminDashboard
    │       ├── ReceptionistDashboard
    │       ├── Appointments
    │       ├── Consultations
    │       ├── Prescriptions
    │       ├── Billing
    │       └── Reports
    └── Error Boundary (optional)
```

## State Management

Using **Zustand** for state management:

```javascript
import { useAuthStore } from './context/authStore'

const { user, isAuthenticated, login, logout } = useAuthStore()
```

## API Integration

All API calls go through Axios with automatic token injection:

```javascript
import { appointmentService } from './services'

const appointments = await appointmentService.getAll()
```

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS variables** in `globals.css`
- Responsive design (mobile-first)

## Key Dependencies

- **React 18+** - UI Framework
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Zustand** - State Management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Date-fns** - Date manipulation
- **React-Toastify** - Notifications
- **Chart.js** - Charts and graphs
- **React-PDF** - PDF viewer

## Development Guidelines

1. **Component Organization**: One component per file
2. **Naming**: Use PascalCase for components, camelCase for functions
3. **Hooks**: Use custom hooks for repeated logic
4. **Error Handling**: Always handle API errors with try-catch
5. **Loading States**: Show loading indicators during API calls
6. **Accessibility**: Use semantic HTML and ARIA labels

## Common Tasks

### Add New Page

1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Layout.jsx`

### Add New Service Call

1. Add function to `src/services/index.js`
2. Use in component with `useFetch` hook
3. Handle errors with `react-toastify`

### Add Styling

1. Use Tailwind classes in JSX
2. Or add custom CSS to `src/styles/globals.css`
3. Follow existing color scheme

## Performance Optimization

- Code splitting via React Router
- Lazy loading of components
- Memoization of expensive computations
- Efficient re-renders with proper key props

## Testing

```bash
npm test
```

## Production Build

```bash
npm run build
```

Generates optimized build in `dist/` directory.

## Troubleshooting

### API Connection Error
- Check `VITE_API_URL` in `.env.local`
- Ensure backend is running on port 5000
- Check CORS configuration

### Styling Issues
- Clear node_modules and reinstall
- Rebuild Tailwind cache
- Check `tailwind.config.js`

### Authentication Errors
- Check JWT token in localStorage
- Verify token hasn't expired
- Check user role permissions

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Add PropTypes or TypeScript types
4. Write meaningful component names
5. Add comments for complex logic

## Documentation

- [API Documentation](../docs/API.md)
- [Setup Guide](../docs/SETUP.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)

## License

MIT
