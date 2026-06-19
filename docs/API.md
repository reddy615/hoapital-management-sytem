# Hospital Management System - API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@hospital.com",
    "password": "securepass123",
    "role": "patient"
  }
  ```
- **Response:** User object + JWT token

### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@hospital.com",
    "password": "securepass123"
  }
  ```
- **Response:** User object + JWT token

### Get Profile
- **GET** `/auth/profile`
- **Authorization:** Required
- **Response:** Current user profile

### Logout
- **POST** `/auth/logout`
- **Authorization:** Required

---

## Patient Endpoints

### Get All Patients
- **GET** `/patients`
- **Authorization:** Required
- **Response:** Array of patient objects

### Get Patient by ID
- **GET** `/patients/:id`
- **Authorization:** Required
- **Response:** Patient object with medical history

### Create Patient
- **POST** `/patients`
- **Authorization:** Required
- **Body:**
  ```json
  {
    "userId": "user_id",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "bloodType": "O+",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "1234567890",
      "relationship": "spouse"
    }
  }
  ```

### Update Patient
- **PUT** `/patients/:id`
- **Authorization:** Required

### Delete Patient
- **DELETE** `/patients/:id`
- **Authorization:** Required

---

## Doctor Endpoints

### Get All Doctors
- **GET** `/doctors`
- **Response:** Array of doctor objects

### Get Doctor by ID
- **GET** `/doctors/:id`
- **Response:** Doctor profile with specialization

### Get Doctors by Specialization
- **GET** `/doctors/specialization/:spec`
- **Params:** specialization (e.g., "Cardiology")

### Get Doctor Availability
- **GET** `/doctors/:id/availability`
- **Response:** Available time slots

### Update Doctor Availability
- **PUT** `/doctors/:id/availability`
- **Body:**
  ```json
  {
    "slots": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "17:00"
      }
    ]
  }
  ```

### Create Doctor
- **POST** `/doctors`
- **Authorization:** Required (Admin only)

---

## Appointment Endpoints

### Get All Appointments
- **GET** `/appointments`
- **Authorization:** Required

### Get Appointment by ID
- **GET** `/appointments/:id`
- **Authorization:** Required

### Book Appointment
- **POST** `/appointments`
- **Authorization:** Required
- **Body:**
  ```json
  {
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "appointmentDate": "2024-01-20T10:30:00Z",
    "timeSlot": "10:30",
    "type": "in-person",
    "reason": "Regular checkup"
  }
  ```

### Update Appointment
- **PUT** `/appointments/:id`
- **Authorization:** Required

### Cancel Appointment
- **PUT** `/appointments/:id/cancel`
- **Authorization:** Required

---

## Consultation Endpoints

### Get All Consultations
- **GET** `/consultations`
- **Authorization:** Required

### Get Consultation by ID
- **GET** `/consultations/:id`
- **Authorization:** Required

### Create Consultation
- **POST** `/consultations`
- **Authorization:** Required
- **Body:**
  ```json
  {
    "appointmentId": "appointment_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "symptoms": ["fever", "cough"],
    "diagnosis": "Common cold",
    "notes": "Patient advised rest and fluids",
    "recommendations": "Take prescribed medications"
  }
  ```

### Update Consultation
- **PUT** `/consultations/:id`
- **Authorization:** Required

---

## Prescription Endpoints

### Get All Prescriptions
- **GET** `/prescriptions`
- **Authorization:** Required

### Get Prescription by ID
- **GET** `/prescriptions/:id`
- **Authorization:** Required

### Create Prescription
- **POST** `/prescriptions`
- **Authorization:** Required
- **Body:**
  ```json
  {
    "consultationId": "consultation_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "medications": [
      {
        "name": "Aspirin",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days"
      }
    ]
  }
  ```

### Download Prescription PDF
- **GET** `/prescriptions/:id/pdf`
- **Authorization:** Required
- **Response:** PDF file download

---

## Billing Endpoints

### Get All Bills
- **GET** `/billing`
- **Authorization:** Required

### Get Bill by ID
- **GET** `/billing/:id`
- **Authorization:** Required

### Create Bill
- **POST** `/billing`
- **Authorization:** Required
- **Body:**
  ```json
  {
    "patientId": "patient_id",
    "appointmentId": "appointment_id",
    "services": [
      {
        "description": "Consultation",
        "quantity": 1,
        "rate": 100,
        "amount": 100
      }
    ],
    "totalAmount": 100,
    "discountAmount": 0,
    "finalAmount": 100,
    "paymentMethod": "card"
  }
  ```

### Generate Invoice
- **GET** `/billing/:id/invoice`
- **Authorization:** Required
- **Response:** PDF invoice download

---

## Reports Endpoints

### Patient Statistics
- **GET** `/reports/patients`
- **Authorization:** Required
- **Response:** Patient analytics

### Doctor Performance
- **GET** `/reports/doctors`
- **Authorization:** Required
- **Response:** Doctor statistics

### Financial Report
- **GET** `/reports/financial`
- **Authorization:** Required
- **Response:** Revenue and financial metrics

### Appointment Report
- **GET** `/reports/appointments`
- **Authorization:** Required
- **Response:** Appointment statistics

---

## Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Server Error |

---

## Error Response Format

```json
{
  "message": "Error description",
  "status": 400
}
```
