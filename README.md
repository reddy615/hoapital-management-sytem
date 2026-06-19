# Hospital Management System

A comprehensive healthcare management platform with real-time appointment scheduling, patient records, doctor dashboards, consultation tracking, prescription management, and billing.

## System Architecture

```
Frontend (React + Vite + Tailwind)
    ↓
Backend (Node.js + Express)
    ↓
MongoDB Atlas Database
    ↓
External Services (Cloudinary, Nodemailer, PDFKit, Gemini AI)
```

## Features

### Authentication & Authorization
- Role-based access control (Admin, Doctor, Receptionist, Patient)
- JWT token-based authentication
- Secure password hashing

### Patient Management
- Patient registration and profile management
- Medical history tracking
- Document uploads
- Insurance information

### Doctor Management
- Doctor profile and specialization
- Schedule management
- Availability tracking
- Ratings and reviews

### Appointment System
- Real-time appointment booking
- Schedule management
- Appointment reminders via email
- Cancellation and rescheduling

### Consultation Module
- Virtual and in-person consultations
- Consultation notes and history
- Follow-up tracking
- AI-powered health insights (Gemini API)

### Prescription Management
- Prescription generation and tracking
- PDF export
- Prescription history
- Medication interaction checks

### Billing & Payments
- Automated invoice generation
- Payment tracking
- Insurance claim management
- Financial reports

### Reports Module
- Patient analytics
- Doctor performance metrics
- Financial reports
- Room utilization reports

### Dashboard Analytics
- Real-time statistics
- Appointment trends
- Revenue analytics
- Patient demographics

## Tech Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** React Context API / Zustand
- **Charts:** Chart.js / Recharts
- **PDF Viewer:** React-PDF
- **Notifications:** React-Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email Service:** Nodemailer
- **File Upload:** Multer + Cloudinary
- **PDF Generation:** PDFKit
- **AI Integration:** Gemini API
- **Validation:** Joi
- **API Documentation:** Swagger/OpenAPI

### Database
- **Primary:** MongoDB Atlas
- **Collections:** Users, Patients, Doctors, Appointments, Consultations, Prescriptions, Bills, Rooms, Staff, AuditLogs

### External Services
- **Cloud Storage:** Cloudinary
- **Email Service:** Nodemailer (Gmail/Custom SMTP)
- **PDF Generation:** PDFKit
- **AI Services:** Google Gemini API

## Project Structure

```
hospital/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context providers
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                  # Express.js application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── models/          # Mongoose schemas
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── config/          # Configuration files
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/                     # Project documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── .github/
│   └── copilot-instructions.md
│
├── package.json              # Root package.json
├── .gitignore
└── README.md                 # This file
```

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for Nodemailer)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   cd hospital
   npm run install:all
   ```

2. **Setup Environment Variables**

   Frontend (`.env.local`):
   ```
   VITE_API_URL=http://localhost:5000
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

   Backend (`.env`):
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hospital
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## API Documentation

See [API.md](docs/API.md) for complete API documentation.

## Database Schema

See [DATABASE.md](docs/DATABASE.md) for detailed database schema.

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@hospital-system.com or open an issue on GitHub.
