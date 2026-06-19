import { useState } from 'react'

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="My Appointments" value="5" />
        <StatCard label="Active Prescriptions" value="3" />
        <StatCard label="Outstanding Bills" value="$250" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          <p className="text-gray-600">Your upcoming appointments will appear here</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Medical History</h2>
          <p className="text-gray-600">Your medical history and documents</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card bg-white border-t-4 border-primary">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
