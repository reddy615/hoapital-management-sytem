import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

export const generatePrescriptionPDF = (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const fileName = `prescription_${prescription._id}.pdf`
      const filePath = path.join('uploads', fileName)
      
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      // Header
      doc.fontSize(20).text('Hospital Management System', 100, 50)
      doc.fontSize(12).text('Prescription', 100, 80)
      
      doc.moveTo(100, 100).lineTo(500, 100).stroke()

      // Patient Info
      doc.fontSize(10).text(`Patient Name: ${patient.userId.name}`, 100, 120)
      doc.text(`Date of Birth: ${patient.dateOfBirth || 'N/A'}`, 100, 135)
      
      // Doctor Info
      doc.text(`Doctor: ${doctor.userId.name}`, 100, 155)
      doc.text(`Specialization: ${doctor.specialization}`, 100, 170)

      // Medications
      doc.fontSize(12).text('Medications', 100, 200)
      let yPosition = 220
      
      prescription.medications.forEach((med, index) => {
        doc.fontSize(10)
        doc.text(`${index + 1}. ${med.name}`, 100, yPosition)
        doc.text(`   Dosage: ${med.dosage}`, 110, yPosition + 15)
        doc.text(`   Frequency: ${med.frequency}`, 110, yPosition + 30)
        doc.text(`   Duration: ${med.duration}`, 110, yPosition + 45)
        yPosition += 70
      })

      // Notes
      if (prescription.notes) {
        doc.fontSize(12).text('Additional Notes', 100, yPosition)
        doc.fontSize(10).text(prescription.notes, 100, yPosition + 20)
      }

      doc.end()

      stream.on('finish', () => {
        resolve(filePath)
      })

      stream.on('error', (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const generateInvoicePDF = (bill, patient) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const fileName = `invoice_${bill._id}.pdf`
      const filePath = path.join('uploads', fileName)
      
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      // Header
      doc.fontSize(20).text('Hospital Management System', 100, 50)
      doc.fontSize(12).text(`Invoice #${bill.billNumber}`, 100, 80)
      
      doc.moveTo(100, 100).lineTo(500, 100).stroke()

      // Patient Info
      doc.fontSize(10).text(`Patient: ${patient.userId.name}`, 100, 120)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, 135)

      // Services
      doc.fontSize(12).text('Services', 100, 170)
      let yPosition = 190
      
      bill.services.forEach((service) => {
        doc.fontSize(10)
        doc.text(service.description, 100, yPosition)
        doc.text(`Qty: ${service.quantity} x $${service.rate} = $${service.amount}`, 110, yPosition + 15)
        yPosition += 40
      })

      // Totals
      doc.moveTo(100, yPosition).lineTo(500, yPosition).stroke()
      yPosition += 20
      
      doc.fontSize(10).text(`Total Amount: $${bill.totalAmount}`, 100, yPosition)
      doc.text(`Discount: $${bill.discountAmount}`, 100, yPosition + 15)
      doc.fontSize(12).text(`Final Amount: $${bill.finalAmount}`, 100, yPosition + 35, { bold: true })

      doc.end()

      stream.on('finish', () => {
        resolve(filePath)
      })

      stream.on('error', (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}
