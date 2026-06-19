import mongoose from 'mongoose'

const billSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    billNumber: {
      type: String,
      unique: true,
    },
    services: [
      {
        description: String,
        quantity: Number,
        rate: Number,
        amount: Number,
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'insurance'],
    },
    notes: String,
    invoiceUrl: String,
  },
  { timestamps: true }
)

export const Bill = mongoose.model('Bill', billSchema)
