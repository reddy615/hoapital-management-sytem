import mongoose from 'mongoose'

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
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
    startTime: Date,
    endTime: Date,
    symptoms: [String],
    diagnosis: String,
    notes: String,
    recommendations: String,
    followUpDate: Date,
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
)

export const Consultation = mongoose.model('Consultation', consultationSchema)
