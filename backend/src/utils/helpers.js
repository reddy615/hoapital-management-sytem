export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const getTimeSlots = (startTime, endTime, slotDuration = 30) => {
  const slots = []
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)
  
  while (start < end) {
    slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    start.setMinutes(start.getMinutes() + slotDuration)
  }
  
  return slots
}
