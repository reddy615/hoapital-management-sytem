import express from 'express'
import { Appointment } from '../models/Appointment.js'
import { Prescription } from '../models/Prescription.js'
import { Bill } from '../models/Bill.js'

const router = express.Router()

router.get('/patients', async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$patientId',
          count: { $sum: 1 }
        }
      }
    ])
    res.json({ totalPatients: stats.length, stats })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/doctors', async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$doctorId',
          appointmentCount: { $sum: 1 }
        }
      }
    ])
    res.json({ stats })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/financial', async (req, res) => {
  try {
    const stats = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
          totalBills: { $sum: 1 },
          avgBillAmount: { $avg: '$finalAmount' }
        }
      }
    ])
    res.json(stats[0] || {})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/appointments', async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    res.json({ stats })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
