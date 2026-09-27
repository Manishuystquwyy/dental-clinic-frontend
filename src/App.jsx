import { Link, Outlet } from 'react-router-dom'
import { Suspense, useState } from 'react'
import { useAuth } from './context/AuthContext'
import logoMarkWebp from './assets/logo-mark.webp'
import './App.css'

function App() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="site-root">
      <header className="site-header">
        <div className="brand">
          <img
            src={logoMarkWebp}
            alt="Gayatri Dental Clinic"
            width="256"
            height="256"
            className="brand-logo"
            decoding="async"
          />
          <div className="brand-text">
            <h1>Gayatri Dental Clinic</h1>
            <p>Your Smile is Precious to us.</p>
          </div>
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/book">Book Appointment</Link>
          {user && user.role === 'PATIENT' && <Link to="/patient-dashboard">My Dashboard</Link>}
          {user && user.role === 'DOCTOR' && <Link to="/doctor-dashboard">My Dashboard</Link>}
          {user && user.role === 'PATIENT' && <Link to="/my-profile">My Profile</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/signup" className="cta">Sign Up</Link>}
          {user && <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>}
          {user && <span style={{ fontSize: '0.85rem', color: '#666' }}>{user.name}</span>}
          {user && (
            <button
              onClick={logout}
              style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main>
        <Suspense fallback={<p role="status">Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Gayatri Dental Clinic — All rights reserved</p>
      </footer>
    </div>
  )
}

export default App
