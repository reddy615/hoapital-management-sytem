import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || 'User'}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Appointments" value="1,240" icon="📅" />
        <DashboardCard title="Active Patients" value="856" icon="👥" />
        <DashboardCard title="Doctors" value="42" icon="👨‍⚕️" />
        <DashboardCard title="Revenue" value="$45,200" icon="💰" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Appointments</h2>
          <div className="space-y-3">
            <AppointmentItem />
            <AppointmentItem />
            <AppointmentItem />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn btn-primary w-full">Book Appointment</button>
            <button className="btn btn-secondary w-full">View Reports</button>
            <button className="btn btn-secondary w-full">Manage Doctors</button>
            <button className="btn btn-secondary w-full">View Billing</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-primary">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

function AppointmentItem() {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium">Dr. John Doe</p>
        <p className="text-sm text-gray-600">Today, 2:30 PM</p>
      </div>
      <span className="text-sm font-semibold text-success">Confirmed</span>
    </div>
  )
}
