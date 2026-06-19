import nodemailer from 'nodemailer'
import { config } from '../config/env.js'

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  }
})

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

export const sendAppointmentConfirmation = async (email, appointmentData) => {
  const html = `
    <h2>Appointment Confirmation</h2>
    <p>Your appointment has been confirmed.</p>
    <p><strong>Date:</strong> ${appointmentData.date}</p>
    <p><strong>Time:</strong> ${appointmentData.time}</p>
    <p><strong>Doctor:</strong> ${appointmentData.doctorName}</p>
    <p>Thank you for choosing our hospital.</p>
  `
  
  return sendEmail(email, 'Appointment Confirmation', html)
}

export const sendPrescriptionEmail = async (email, prescriptionData) => {
  const html = `
    <h2>Your Prescription</h2>
    <p>Dear ${prescriptionData.patientName},</p>
    <p>Your prescription is ready. Please find the attached document.</p>
    <p><strong>Doctor:</strong> ${prescriptionData.doctorName}</p>
    <p>Please follow the dosage instructions carefully.</p>
  `
  
  return sendEmail(email, 'Your Prescription', html)
}
