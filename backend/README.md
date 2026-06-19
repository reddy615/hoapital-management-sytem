# Hospital Management System - Backend API

Node.js + Express REST API for Hospital Management System

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## API Available at: http://localhost:5000

## Environment Variables

See `.env.example` for all required configuration.

### Essential Variables

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hospital
JWT_SECRET=your_secure_secret_key
PORT=5000
NODE_ENV=development
```

## API Routes

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get user profile

### Patients
- `GET /patients` - List all patients
- `GET /patients/:id` - Get patient by ID
- `POST /patients` - Create patient
- `PUT /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/specialization/:spec` - Get doctors by specialization
- `GET /doctors/:id/availability` - Get doctor availability
- `PUT /doctors/:id/availability` - Update availability

### Appointments
- `GET /appointments` - List appointments
- `POST /appointments` - Book appointment
- `PUT /appointments/:id` - Update appointment
- `PUT /appointments/:id/cancel` - Cancel appointment

### Consultations
- `GET /consultations` - List consultations
- `POST /consultations` - Create consultation
- `PUT /consultations/:id` - Update consultation

### Prescriptions
- `GET /prescriptions` - List prescriptions
- `POST /prescriptions` - Create prescription
- `GET /prescriptions/:id/pdf` - Download prescription PDF

### Billing
- `GET /billing` - List bills
- `POST /billing` - Create bill
- `GET /billing/:id/invoice` - Download invoice

### Reports
- `GET /reports/patients` - Patient statistics
- `GET /reports/doctors` - Doctor performance
- `GET /reports/financial` - Financial report
- `GET /reports/appointments` - Appointment report

## Project Structure

```
backend/
├── src/
│   ├── server.js          # Entry point
│   ├── config/
│   │   ├── env.js        # Environment config
│   │   └── database.js   # MongoDB connection
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Consultation.js
│   │   ├── Prescription.js
│   │   ├── Bill.js
│   │   ├── Room.js
│   │   └── AuditLog.js
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── middleware/       # Express middleware
│   ├── services/         # External services
│   │   ├── emailService.js
│   │   ├── pdfService.js
│   │   └── aiService.js
│   └── utils/            # Utility functions
├── .env.example
├── package.json
└── README.md
```

## Database Collections

- **Users** - System users with roles
- **Patients** - Patient profiles and medical history
- **Doctors** - Doctor profiles and specialization
- **Appointments** - Appointment scheduling
- **Consultations** - Consultation records
- **Prescriptions** - Prescription details
- **Bills** - Billing and payment tracking
- **Rooms** - Hospital rooms and availability
- **AuditLogs** - System activity logging

## Security Features

- JWT authentication
- Role-based authorization
- Password hashing (bcryptjs)
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention

## External Integrations

### Email Service (Nodemailer)
- Appointment confirmations
- Prescription delivery
- Bill notifications

### File Storage (Cloudinary)
- Document uploads
- Image storage
- PDF hosting

### PDF Generation (PDFKit)
- Prescription PDFs
- Invoice generation

### AI Service (Gemini)
- Health insights
- Symptom analysis

## Scripts

```bash
npm run dev      # Development with nodemon
npm start        # Production mode
npm test         # Run tests
npm test:ci      # CI test with coverage
```

## Error Handling

All endpoints return consistent error format:

```json
{
  "message": "Error description",
  "status": 400
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Testing

```bash
npm test
```

## Performance Tips

- Enable Redis caching for frequently accessed data
- Use database indexes (already configured)
- Implement pagination for large datasets
- Use lean queries for read-only operations

## Troubleshooting

### MongoDB Connection Error
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Email Issues
- Verify EMAIL_USER and EMAIL_PASSWORD
- Enable 2FA and use App Password for Gmail
- Check SMTP settings

### Cloudinary Issues
- Verify API credentials
- Check network access
- Review rate limits

### JWT Errors
- Check JWT_SECRET is set
- Verify token hasn't expired
- Validate token format

## Contributing

1. Follow existing code style
2. Write tests for new features
3. Update documentation
4. Test API endpoints before committing

## Documentation

- [API Documentation](../docs/API.md)
- [Database Schema](../docs/DATABASE.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)

## License

MIT
