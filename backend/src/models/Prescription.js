import mongoose from 'mongoose'

const prescriptionSchema = new mongoose.Schema(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      }
    ],
    notes: String,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'completed'],
      default: 'active',
    },
    pdfUrl: String,
  },
  { timestamps: true }
)

export const Prescription = mongoose.model('Prescription', prescriptionSchema)
