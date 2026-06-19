import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      unique: true,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['general', 'semi-private', 'private', 'icu', 'ot'],
      required: true,
    },
    capacity: Number,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    assignedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    floor: Number,
    amenities: [String],
  },
  { timestamps: true }
)

export const Room = mongoose.model('Room', roomSchema)
