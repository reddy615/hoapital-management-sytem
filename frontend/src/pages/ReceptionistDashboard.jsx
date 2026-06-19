export default function ReceptionistDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Receptionist Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Today's Appointments" value="24" />
        <StatCard label="Walk-ins" value="6" />
        <StatCard label="Check-outs" value="18" />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Appointment Queue</h2>
        <p className="text-gray-600">View and manage today's appointments</p>
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
