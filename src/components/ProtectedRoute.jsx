import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><p>Access Denied. You don't have permission to view this page.</p></div>
  }

  return children
}
