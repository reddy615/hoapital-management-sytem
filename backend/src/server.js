import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'express-async-errors'

import { connectDB } from './config/database.js'
import { config } from './config/env.js'
import { authenticate, authorize, errorHandler, notFound } from './middleware/auth.js'

// Routes
import authRoutes from './routes/auth.js'
import patientRoutes from './routes/patients.js'
import doctorRoutes from './routes/doctors.js'
import appointmentRoutes from './routes/appointments.js'
import consultationRoutes from './routes/consultations.js'
import prescriptionRoutes from './routes/prescriptions.js'
import billingRoutes from './routes/billing.js'
import reportRoutes from './routes/reports.js'

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Hospital Management System API is running' })
})

// Public routes
app.use('/auth', authRoutes)

// Protected routes
app.use('/patients', authenticate, patientRoutes)
app.use('/doctors', authenticate, doctorRoutes)
app.use('/appointments', authenticate, appointmentRoutes)
app.use('/consultations', authenticate, consultationRoutes)
app.use('/prescriptions', authenticate, prescriptionRoutes)
app.use('/billing', authenticate, billingRoutes)
app.use('/reports', authenticate, reportRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(config.PORT, () => {
      console.log(`✓ Server running on http://localhost:${config.PORT}`)
      console.log(`✓ Environment: ${config.NODE_ENV}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
