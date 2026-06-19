import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bloodType: String,
    allergies: [String],
    medicalHistory: [String],
    insuranceProvider: String,
    insurancePolicyNumber: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    documents: [
      {
        type: String,
        url: String,
        uploadedAt: Date,
      }
    ],
  },
  { timestamps: true }
)

export const Patient = mongoose.model('Patient', patientSchema)
