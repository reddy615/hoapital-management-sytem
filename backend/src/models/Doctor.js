import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    licenseNumber: String,
    experience: Number,
    qualification: [String],
    consultationFee: Number,
    bio: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    availableSlots: [
      {
        day: String,
        startTime: String,
        endTime: String,
      }
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const Doctor = mongoose.model('Doctor', doctorSchema)
