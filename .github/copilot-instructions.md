# Copilot Instructions for Hospital Management System

This workspace contains a complete Hospital Management System with React frontend and Node.js backend.

## Project Structure

- **Frontend**: React + Vite + Tailwind CSS - `/frontend`
- **Backend**: Node.js + Express - `/backend`
- **Documentation**: API, Database, Setup, Deployment, Architecture - `/docs`

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start development servers (frontend + backend)
npm run dev
```

## Environment Setup

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
```

See `/docs/SETUP.md` for complete setup instructions.

## Available Commands

```bash
npm run dev           # Run both frontend and backend
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
npm run build         # Build both frontend and backend
npm run install:all   # Install dependencies for all
```

## Key Features

- ✅ Role-based authentication (Admin, Doctor, Patient, Receptionist)
- ✅ Appointment scheduling and management
- ✅ Patient medical records
- ✅ Doctor consultations
- ✅ Prescription generation (PDF)
- ✅ Billing and invoicing
- ✅ Financial reports
- ✅ Email notifications
- ✅ AI health insights (Gemini API)
- ✅ Cloud file storage (Cloudinary)

## API Endpoints

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health

See `/docs/API.md` for complete API documentation.

## Important Files

- `/frontend/package.json` - Frontend dependencies
- `/backend/package.json` - Backend dependencies
- `/backend/src/server.js` - Backend entry point
- `/frontend/src/App.jsx` - Frontend entry point
- `/docs/SETUP.md` - Setup and configuration guide
- `/docs/DEPLOYMENT.md` - Deployment instructions

## Development Guidelines

1. **Code Style**: JavaScript ES6+
2. **Database**: MongoDB with Mongoose ORM
3. **Frontend Framework**: React with Tailwind CSS
4. **Authentication**: JWT tokens
5. **File Upload**: Cloudinary CDN
6. **Email**: Nodemailer with Gmail

## Testing

```bash
cd backend
npm test
```

## Troubleshooting

- Port conflicts: Change PORT in backend .env
- MongoDB connection: Verify connection string and IP whitelist
- Emails not sending: Check Gmail App Password setup
- Frontend not connecting: Verify VITE_API_URL environment variable

## Documentation Links

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture](./docs/ARCHITECTURE.md)

## Support

For issues and questions:
1. Check relevant documentation in `/docs`
2. Review error messages in terminal
3. Verify environment variables
4. Check database connection
5. Review service configurations
