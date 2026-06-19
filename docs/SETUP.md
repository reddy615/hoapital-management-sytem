# Hospital Management System - Setup Guide

## Prerequisites

Before starting, ensure you have:
- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Gmail account with App Password
- Google Gemini API key

## Installation Steps

### 1. Clone or Download Project

```bash
cd hospital
```

### 2. Install Root Dependencies

```bash
npm install
```

This will install `concurrently` for running multiple processes simultaneously.

### 3. Configure Environment Variables

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Fill in your `.env` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# AI Service
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend Setup

1. Create `.env.local` in frontend directory:

```bash
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Install Dependencies

From root directory:
```bash
npm run install:all
```

This will install dependencies for root, frontend, and backend.

### 5. Database Setup

#### MongoDB Atlas Setup:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Replace in `.env`: `mongodb+srv://username:password@cluster.mongodb.net/hospital`

#### Local MongoDB (Optional):

```bash
# Install MongoDB locally and run
mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/hospital
```

### 6. External Services Configuration

#### Gmail Configuration for Emails:

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use generated password in `.env` as `EMAIL_PASSWORD`

#### Cloudinary Setup:

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up and get your API credentials
3. Add to `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### Google Gemini API:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Generate API key
3. Add to `.env` as `GEMINI_API_KEY`

## Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This will start:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

### Individual Development Servers

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Production Build

```bash
npm run build
```

This creates optimized builds for both frontend and backend.

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Run Specific Test

```bash
npm test -- path/to/test.js
```

## Database Seeding (Optional)

Create sample data by adding seed script in `backend/scripts/seed.js`:

```javascript
import { User } from '../models/User.js'
import { Patient } from '../models/Patient.js'
import { Doctor } from '../models/Doctor.js'

// Create test users
const adminUser = await User.create({
  name: 'Admin User',
  email: 'admin@hospital.com',
  password: 'admin123',
  role: 'admin'
})

const doctorUser = await User.create({
  name: 'Dr. John Doe',
  email: 'doctor@hospital.com',
  password: 'doctor123',
  role: 'doctor'
})

// Create doctor profile
await Doctor.create({
  userId: doctorUser._id,
  specialization: 'Cardiology',
  experience: 5,
  licenseNumber: 'LIC123456'
})
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev:backend
```

### MongoDB Connection Error

```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Ensure network access is allowed
```

### Email Not Sending

```bash
# Enable "Less secure app access" or use App Password
# Check EMAIL_USER and EMAIL_PASSWORD in .env
# Verify SMTP credentials
```

### Missing Dependencies

```bash
# Reinstall all dependencies
npm run install:all

# Or manually
cd frontend && npm install
cd ../backend && npm install
```

## API Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "Hospital Management System API is running"
}
```

## Default Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Patient | patient@hospital.com | patient123 |
| Receptionist | receptionist@hospital.com | receptionist123 |

**Note:** Create these accounts manually or through the registration endpoint.

## Next Steps

1. Review [API.md](./API.md) for API endpoints
2. Check [DATABASE.md](./DATABASE.md) for data models
3. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. Explore [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

## Support & Issues

- Check error logs in the terminal
- Enable debug mode: `DEBUG=* npm run dev`
- Review MongoDB connection string
- Verify all environment variables are set
