import api from './api'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  getAllUsers: (params) => api.get('/auth/users', { params }),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
}

export const appointmentService = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
}

export const patientService = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  search: (query) => api.get(`/patients/search?q=${query}`),
}

export const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getBySpecialization: (spec) => api.get(`/doctors/specialization/${spec}`),
  getAvailability: (id) => api.get(`/doctors/${id}/availability`),
  updateAvailability: (id, data) => api.put(`/doctors/${id}/availability`, data),
}

export const consultationService = {
  getAll: () => api.get('/consultations'),
  getById: (id) => api.get(`/consultations/${id}`),
  create: (data) => api.post('/consultations', data),
  update: (id, data) => api.put(`/consultations/${id}`, data),
  getNotes: (id) => api.get(`/consultations/${id}/notes`),
  addNotes: (id, notes) => api.post(`/consultations/${id}/notes`, { notes }),
}

export const prescriptionService = {
  getAll: () => api.get('/prescriptions'),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  generatePDF: (id) => api.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
}

export const billingService = {
  getAll: () => api.get('/billing'),
  getById: (id) => api.get(`/billing/${id}`),
  create: (data) => api.post('/billing', data),
  update: (id, data) => api.put(`/billing/${id}`, data),
  generateInvoice: (id) => api.get(`/billing/${id}/invoice`),
}

export const reportService = {
  getPatientReport: () => api.get('/reports/patients'),
  getDoctorReport: () => api.get('/reports/doctors'),
  getFinancialReport: () => api.get('/reports/financial'),
  getAppointmentReport: () => api.get('/reports/appointments'),
}
