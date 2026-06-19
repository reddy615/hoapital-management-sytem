import express from 'express'
import { Bill } from '../models/Bill.js'
import { generateInvoicePDF } from '../services/pdfService.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().populate('patientId').populate('appointmentId')
    res.json(bills)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate(['patientId', 'appointmentId'])
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' })
    }
    res.json(bill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    // Generate bill number
    const lastBill = await Bill.findOne().sort({ createdAt: -1 })
    const billNumber = lastBill ? `BILL-${parseInt(lastBill.billNumber.split('-')[1]) + 1}` : 'BILL-1001'
    
    const bill = new Bill({
      ...req.body,
      billNumber
    })
    await bill.save()
    await bill.populate(['patientId', 'appointmentId'])
    res.status(201).json(bill)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['patientId', 'appointmentId'])
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' })
    }
    res.json(bill)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id/invoice', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('patientId')
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' })
    }

    const filePath = await generateInvoicePDF(bill, bill.patientId)
    res.download(filePath)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
