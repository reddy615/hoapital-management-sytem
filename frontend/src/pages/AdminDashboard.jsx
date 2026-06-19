export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="1,250" color="blue" />
        <StatCard label="Active Doctors" value="42" color="green" />
        <StatCard label="Total Appointments" value="8,456" color="purple" />
        <StatCard label="Monthly Revenue" value="$45,200" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">System Health</h2>
          <p className="text-gray-600">System status and analytics</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <p className="text-gray-600">Recent system activities and logs</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    purple: 'border-purple-500 bg-purple-50',
    orange: 'border-orange-500 bg-orange-50',
  }

  return (
    <div className={`card ${colors[color]} border-t-4`}>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
