import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
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
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: String,
    type: {
      type: String,
      enum: ['in-person', 'virtual'],
      default: 'in-person',
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    reason: String,
    notes: String,
    roomNumber: String,
  },
  { timestamps: true }
)

export const Appointment = mongoose.model('Appointment', appointmentSchema)
