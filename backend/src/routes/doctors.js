import express from 'express'
import { Doctor } from '../models/Doctor.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email phone')
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId')
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/specialization/:spec', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialization: req.params.spec }).populate('userId', 'name')
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const doctor = new Doctor(req.body)
    await doctor.save()
    await doctor.populate('userId')
    res.status(201).json(doctor)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }
    res.json(doctor)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }
    res.json(doctor.availableSlots)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availableSlots: req.body.slots },
      { new: true }
    )
    res.json(doctor)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
