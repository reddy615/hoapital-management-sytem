import express from 'express'
import { Consultation } from '../models/Consultation.js'
import { generateHealthInsight } from '../services/aiService.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId')
    res.json(consultations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }
    res.json(consultation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const consultation = new Consultation(req.body)
    await consultation.save()
    await consultation.populate(['patientId', 'doctorId', 'appointmentId'])
    
    // Generate AI insights
    const aiInsights = await generateHealthInsight({
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      notes: consultation.notes
    })
    
    res.status(201).json({
      ...consultation.toObject(),
      aiInsights
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['patientId', 'doctorId'])
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }
    res.json(consultation)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
