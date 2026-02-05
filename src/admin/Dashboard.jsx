import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user?.name}!</p>
        
        <div className="admin-grid">
          <Link to="/admin/doctors" className="admin-card">
            <h3>Manage Doctors</h3>
            <p>Add, edit, remove doctors</p>
          </Link>
          <Link to="/admin/services" className="admin-card">
            <h3>Manage Services</h3>
            <p>Add, edit, remove services</p>
          </Link>
          <Link to="/admin/appointments" className="admin-card">
            <h3>Appointments</h3>
            <p>Approve or reject appointments</p>
          </Link>
        </div>
      </section>
    </ProtectedRoute>
  )
}
