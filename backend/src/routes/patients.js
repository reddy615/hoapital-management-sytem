import express from 'express'
import { Patient } from '../models/Patient.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email phone')
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId')
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body)
    await patient.save()
    await patient.populate('userId')
    res.status(201).json(patient)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json(patient)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
