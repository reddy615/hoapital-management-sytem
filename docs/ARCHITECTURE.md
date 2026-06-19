# Hospital Management System - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
├─────────────────────────────────────────────────────────────┤
│  React SPA (Vite)                                           │
│  - Authentication UI                                        │
│  - Dashboard Components                                     │
│  - Real-time Updates (WebSocket Ready)                      │
└─────────────┬───────────────────────────────────────────────┘
              │ HTTPS
┌─────────────┴───────────────────────────────────────────────┐
│                    API Layer                                 │
├─────────────────────────────────────────────────────────────┤
│  Express.js REST API                                        │
│  - Authentication Service                                   │
│  - Appointment Management                                   │
│  - Prescription Service                                     │
│  - Billing System                                          │
│  - Report Generation                                        │
│  - AI Integration (Gemini)                                 │
└─────────────┬───────────────────────────────────────────────┘
              │
┌─────────────┴───────────────────────────────────────────────┐
│               Business Logic Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Services:                                                  │
│  - Authentication & Authorization                          │
│  - Patient Management                                      │
│  - Doctor Scheduling                                       │
│  - Consultation Processing                                 │
│  - Prescription Generation                                 │
│  - Billing & Invoicing                                     │
│  - Email Notifications                                     │
│  - PDF Generation                                          │
│  - AI Insights                                             │
└─────────────┬───────────────────────────────────────────────┘
              │
┌─────────────┴───────────────────────────────────────────────┐
│               Data Layer                                     │
├─────────────────────────────────────────────────────────────┤
│  MongoDB                                                    │
│  - Users, Patients, Doctors                                │
│  - Appointments, Consultations                             │
│  - Prescriptions, Bills                                    │
│  - Audit Logs, Rooms                                       │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

```
App (React Router)
├── Authentication Module
│   ├── Login Component
│   ├── Registration
│   └── Profile Management
│
├── Admin Dashboard
│   ├── User Management
│   ├── System Analytics
│   ├── Financial Reports
│   └── Settings
│
├── Doctor Dashboard
│   ├── Schedule Management
│   ├── Patient Consultations
│   ├── Prescription Issuance
│   └── Performance Metrics
│
├── Patient Dashboard
│   ├── Appointment Booking
│   ├── Medical History
│   ├── Prescriptions
│   └── Billing
│
├── Receptionist Dashboard
│   ├── Appointment Queue
│   ├── Check-in/Check-out
│   └── Patient Registration
│
└── Shared Components
    ├── Layout (Sidebar, Header)
    ├── UI Components
    ├── Forms
    └── Charts/Analytics
```

### Backend Architecture

```
Express Server
├── Middleware Layer
│   ├── Authentication (JWT)
│   ├── Authorization (Role-based)
│   ├── Error Handling
│   ├── CORS
│   └── Request Logging
│
├── Route Layer
│   ├── /auth
│   ├── /patients
│   ├── /doctors
│   ├── /appointments
│   ├── /consultations
│   ├── /prescriptions
│   ├── /billing
│   └── /reports
│
├── Controller Layer
│   └── Business logic handlers
│
├── Service Layer
│   ├── Email Service
│   ├── PDF Generation
│   ├── File Upload (Cloudinary)
│   ├── AI Service (Gemini)
│   └── Notification Service
│
├── Model Layer (Mongoose)
│   ├── User Schema
│   ├── Patient Schema
│   ├── Doctor Schema
│   ├── Appointment Schema
│   ├── Consultation Schema
│   ├── Prescription Schema
│   ├── Bill Schema
│   └── AuditLog Schema
│
└── Utility Layer
    ├── Authentication Utils
    ├── Validation
    ├── Time Slot Generation
    └── Error Messages
```

## Data Flow

### Appointment Booking Flow

```
1. Patient selects doctor & date in React UI
   ↓
2. Frontend calls POST /appointments
   ↓
3. Express receives request with JWT token
   ↓
4. Authentication middleware validates token
   ↓
5. Appointment controller processes request
   ↓
6. Validation of patient/doctor/time slot
   ↓
7. Create appointment in MongoDB
   ↓
8. Email notification sent via Nodemailer
   ↓
9. Response sent to frontend
   ↓
10. Frontend displays confirmation
```

### Consultation & Prescription Flow

```
1. Doctor starts consultation after appointment
   ↓
2. Doctor enters symptoms, diagnosis in React UI
   ↓
3. Frontend sends consultation data via API
   ↓
4. Backend receives & saves consultation
   ↓
5. AI Service (Gemini) generates health insights
   ↓
6. Doctor creates prescription
   ↓
7. PDF generated via PDFKit
   ↓
8. Email sent with prescription to patient
   ↓
9. Patient receives notification
```

### Billing Flow

```
1. Appointment completed
   ↓
2. Receptionist generates bill
   ↓
3. Services & charges entered
   ↓
4. Bill stored in MongoDB with unique ID
   ↓
5. Invoice PDF generated
   ↓
6. Email sent to patient
   ↓
7. Payment status tracked
   ↓
8. Financial reports updated
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│        HTTPS Encryption                 │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│     Firewall & Rate Limiting             │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│      CORS & CSRF Protection              │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│    JWT Authentication                    │
│    - Token Validation                    │
│    - Expiration Management               │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│    Role-Based Authorization              │
│    - Admin, Doctor, Patient              │
│    - Receptionist, Staff                 │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│    Input Validation & Sanitization       │
│    - Joi Schema Validation               │
│    - MongoDB Query Protection            │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│    Password Encryption (bcrypt)          │
│    - Salted Hashing                      │
│    - Secure Comparison                   │
└─────────────────────────────────────────┘
```

## Integration Points

### External Services

```
Hospital System
├── Cloudinary
│   ├── Profile Picture Upload
│   ├── Document Storage
│   └── Prescription PDFs
│
├── Nodemailer (Gmail)
│   ├── Appointment Confirmations
│   ├── Prescription Delivery
│   ├── Bill Notifications
│   └── System Alerts
│
├── PDFKit
│   ├── Prescription Generation
│   ├── Invoice Creation
│   └── Report Compilation
│
├── Google Gemini API
│   ├── Health Insights
│   ├── Symptom Analysis
│   └── Recommendations
│
└── MongoDB Atlas
    ├── Data Storage
    ├── Backups
    └── Analytics
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| File Upload | Cloudinary, Multer |
| PDF Generation | PDFKit |
| Email | Nodemailer |
| AI | Google Gemini API |
| Charts | Chart.js, Recharts |
| Deployment | Docker, CI/CD Ready |

## API Rate Limiting

```javascript
// Example rate limiting middleware
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)
```

## Performance Considerations

1. **Database Indexing**
   - Email field (unique)
   - User ID references
   - Appointment date
   - Patient/Doctor IDs

2. **Caching Strategy**
   - Doctor list (3600s)
   - Patient records (1800s)
   - Availability slots (600s)

3. **Query Optimization**
   - Lean queries for read-only
   - Projection to select fields
   - Pagination for large datasets

4. **Horizontal Scaling**
   - Load balancer
   - Multiple backend instances
   - Database replication

## Monitoring & Logging

```
Application
├── Error Logging
│   ├── File-based logs
│   ├── Stack traces
│   └── Error context
│
├── Access Logging
│   ├── Request timestamps
│   ├── IP addresses
│   ├── Endpoints accessed
│   └── Response times
│
└── Performance Monitoring
    ├── Response times
    ├── Database query times
    ├── API throughput
    └── Resource usage
```

## Compliance & Standards

- HIPAA compliance (PII protection)
- GDPR data protection
- HL7/FHIR healthcare standards
- SOC 2 security practices
- OWASP security guidelines
