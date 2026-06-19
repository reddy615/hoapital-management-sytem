import axios from 'axios'
import { config } from '../config/env.js'

export const generateHealthInsight = async (consultationData) => {
  try {
    if (!config.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured')
      return null
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Based on the following consultation data, provide brief health insights and recommendations:
            Symptoms: ${consultationData.symptoms?.join(', ')}
            Diagnosis: ${consultationData.diagnosis}
            Notes: ${consultationData.notes}
            
            Please provide 2-3 brief recommendations in JSON format.`
          }]
        }]
      }
    )

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (error) {
    console.error('Gemini API error:', error.message)
    return null
  }
}
