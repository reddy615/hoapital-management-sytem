import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: String,
    module: String,
    recordId: String,
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
)

export const AuditLog = mongoose.model('AuditLog', auditLogSchema)
