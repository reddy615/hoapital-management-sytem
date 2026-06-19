# Database Schema Documentation

## Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'doctor', 'patient', 'receptionist', 'staff']),
  phone: String,
  avatar: String (Cloudinary URL),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Patients Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  dateOfBirth: Date,
  gender: String (enum: ['male', 'female', 'other']),
  bloodType: String,
  allergies: [String],
  medicalHistory: [String],
  insuranceProvider: String,
  insurancePolicyNumber: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  documents: [{
    type: String,
    url: String (Cloudinary URL),
    uploadedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Doctors Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  specialization: String (required),
  licenseNumber: String,
  experience: Number,
  qualification: [String],
  consultationFee: Number,
  bio: String,
  rating: Number (0-5, default: 0),
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Appointments Collection

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  doctorId: ObjectId (ref: Doctor, required),
  appointmentDate: Date (required),
  timeSlot: String,
  type: String (enum: ['in-person', 'virtual'], default: 'in-person'),
  status: String (enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']),
  reason: String,
  notes: String,
  roomNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Consultations Collection

```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointment, required),
  patientId: ObjectId (ref: Patient, required),
  doctorId: ObjectId (ref: Doctor, required),
  startTime: Date,
  endTime: Date,
  symptoms: [String],
  diagnosis: String,
  notes: String,
  recommendations: String,
  followUpDate: Date,
  status: String (enum: ['scheduled', 'in-progress', 'completed', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

## Prescriptions Collection

```javascript
{
  _id: ObjectId,
  consultationId: ObjectId (ref: Consultation, required),
  patientId: ObjectId (ref: Patient, required),
  doctorId: ObjectId (ref: Doctor, required),
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  notes: String,
  expiryDate: Date,
  status: String (enum: ['active', 'expired', 'completed']),
  pdfUrl: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

## Bills Collection

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  appointmentId: ObjectId (ref: Appointment),
  billNumber: String (unique),
  services: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  totalAmount: Number (required),
  discountAmount: Number (default: 0),
  finalAmount: Number (required),
  paymentStatus: String (enum: ['pending', 'partial', 'paid', 'refunded']),
  paymentMethod: String (enum: ['cash', 'card', 'transfer', 'insurance']),
  notes: String,
  invoiceUrl: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

## Rooms Collection

```javascript
{
  _id: ObjectId,
  roomNumber: String (unique, required),
  roomType: String (enum: ['general', 'semi-private', 'private', 'icu', 'ot'], required),
  capacity: Number,
  isAvailable: Boolean (default: true),
  assignedPatient: ObjectId (ref: Patient),
  floor: Number,
  amenities: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## AuditLogs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: String,
  module: String,
  recordId: String,
  changes: {
    before: Mixed,
    after: Mixed
  },
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

Recommended indexes for performance:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Patients
db.patients.createIndex({ userId: 1 })

// Doctors
db.doctors.createIndex({ specialization: 1 })

// Appointments
db.appointments.createIndex({ patientId: 1 })
db.appointments.createIndex({ doctorId: 1 })
db.appointments.createIndex({ appointmentDate: 1 })

// Consultations
db.consultations.createIndex({ patientId: 1 })
db.consultations.createIndex({ doctorId: 1 })

// Bills
db.bills.createIndex({ patientId: 1 })
db.bills.createIndex({ billNumber: 1 }, { unique: true })

// AuditLogs
db.auditlogs.createIndex({ userId: 1 })
db.auditlogs.createIndex({ createdAt: -1 })
```

## Relationships Diagram

```
User (1) ──── (1) Patient
         ──── (1) Doctor

Patient (1) ───── (M) Appointments ───── (1) Doctor
              ──── (M) Consultations
              ──── (M) Prescriptions
              ──── (M) Bills
              ──── (M) Rooms

Consultation (1) ──── (M) Prescriptions
                  ──── (1) Appointments
```
