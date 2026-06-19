import express from 'express'
import { Prescription } from '../models/Prescription.js'
import { generatePrescriptionPDF } from '../services/pdfService.js'
import { Patient } from '../models/Patient.js'
import { Doctor } from '../models/Doctor.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patientId')
      .populate('doctorId')
    res.json(prescriptions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }
    res.json(prescription)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const prescription = new Prescription(req.body)
    await prescription.save()
    await prescription.populate(['patientId', 'doctorId'])
    res.status(201).json(prescription)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['patientId', 'doctorId'])
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }
    res.json(prescription)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id/pdf', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }

    const patient = prescription.patientId
    const doctor = prescription.doctorId
    
    const filePath = await generatePrescriptionPDF(prescription, patient, doctor)
    res.download(filePath)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
