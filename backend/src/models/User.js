import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'doctor', 'patient', 'receptionist', 'staff'],
        message: 'Role must be one of: admin, doctor, patient, receptionist, staff'
      },
      default: 'patient'
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    avatar: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    lastLogin: Date,
    lastPasswordChange: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ createdAt: -1 })

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    if (!this.isNew) {
      this.lastPasswordChange = new Date()
    }
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password)
}

// Check if account is locked
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now()
}

// Increment login attempts
userSchema.methods.incLoginAttempts = async function () {
  // Reset if lock expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    })
  }

  // Increment attempts
  const updates = { $inc: { loginAttempts: 1 } }

  // Lock if max attempts reached
  const MAX_LOGIN_ATTEMPTS = 5
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isAccountLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) } // 2 hours
  }

  return this.updateOne(updates)
}

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  })
}

// Hide sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.passwordResetToken
  delete user.passwordResetTokenExpires
  delete user.emailVerificationToken
  delete user.emailVerificationTokenExpires
  delete user.loginAttempts
  delete user.lockUntil
  return user
}

export const User = mongoose.model('User', userSchema)
