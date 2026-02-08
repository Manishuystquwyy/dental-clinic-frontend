import { Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const { user, logout } = useAuth()
  return (
    <div className="site-root">
      <header className="site-header">
        <div className="brand">
          <img
            src="/src/assets/logo.jpeg"
            alt="Gayatri Dental Clinic"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/src/assets/logo.svg'
            }}
          />
          <div className="brand-text">
            <h1>Gayatri Dental Clinic</h1>
            <p>Your Smile is Precious to us.</p>
          </div>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/doctors">Doctors</a>
          <a href="/gallery">Gallery</a>
          <a href="/book">Book</a>
          {user && user.role === 'PATIENT' && <a href="/patient-dashboard">My Dashboard</a>}
          {user && user.role === 'PATIENT' && <a href="/my-profile">My Profile</a>}
          {!user && <a href="/login">Login</a>}
          {!user && <a href="/signup" className="cta">Sign Up</a>}
          {user && <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>}
          {user && <span style={{ fontSize: '0.85rem', color: '#666' }}>{user.name}</span>}
          {user && <button onClick={logout} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>Logout</button>}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Gayatri Dental Clinic — All rights reserved</p>
      </footer>
    </div>
  )
}

export default App
