import mongoose from 'mongoose'
import { config } from './env.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  await mongoose.disconnect()
}
