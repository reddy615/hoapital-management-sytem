import express from 'express'
import { Appointment } from '../models/Appointment.js'
import { sendAppointmentConfirmation } from '../services/emailService.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId')
      .populate('doctorId')
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body)
    await appointment.save()
    await appointment.populate(['patientId', 'doctorId'])
    
    // Send confirmation email
    if (appointment.patientId?.userId?.email) {
      await sendAppointmentConfirmation(appointment.patientId.userId.email, {
        date: appointment.appointmentDate,
        time: appointment.timeSlot,
        doctorName: appointment.doctorId?.userId?.name
      })
    }
    
    res.status(201).json(appointment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['patientId', 'doctorId'])
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.json(appointment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id/cancel', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.json({ message: 'Appointment cancelled', appointment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
