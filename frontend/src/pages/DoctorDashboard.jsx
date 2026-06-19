export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Today's Appointments" value="8" />
        <StatCard label="Pending Consultations" value="2" />
        <StatCard label="Patients Treated" value="156" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
          <p className="text-gray-600">Your schedule for today</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Patient Consultations</h2>
          <p className="text-gray-600">Recent consultations and notes</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card bg-white border-t-4 border-secondary">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
