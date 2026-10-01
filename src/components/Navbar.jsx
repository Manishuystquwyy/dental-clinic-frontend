import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { clinic } from '../data/clinic'
import { Button } from './ui'
import logo from '../assets/logo-mark.webp'
export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const toggle = useRef(null)
  useEffect(() => {
    const scroll = () => setCompact(window.scrollY > 32)
    scroll()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  const dashboard = user?.role === 'ADMIN' ? '/admin' : user?.role === 'DOCTOR' ? '/doctor-dashboard' : '/patient-dashboard'
  return <header className={`g-header ${compact ? 'is-compact' : ''}`}>
    <div className="g-topbar"><span>Thoughtful dentistry. A healthier you.</span><a href={clinic.phoneHref}><Phone size={12} /> {clinic.phone}</a></div>
    <div className="g-nav-shell">
      <Link to="/" className="g-brand" onClick={() => setOpen(false)}><img src={logo} alt="" width="46" height="46" /><span>GAYATRI<small>DENTAL CLINIC</small></span></Link>
      <button ref={toggle} className="g-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="primary-navigation" aria-label="Main navigation" className={`g-nav ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus() } }}>
        <NavLink to="/" end>Home</NavLink><NavLink to="/about">About Us</NavLink><NavLink to="/services">Treatments</NavLink><NavLink to="/doctors">Dentists</NavLink><Link to="/#smiles">Before & After</Link><NavLink to="/contact">Contact</NavLink>
        <div className="g-account">{user ? <><Link to={dashboard}>Dashboard</Link>{user.role === 'PATIENT' && <Link to="/my-profile">Profile</Link>}<button onClick={logout}>Logout</button></> : <><Link to="/login">Login</Link><Link to="/signup">Sign up</Link></>}</div>
        <Button to="/book">Book Appointment</Button>
      </nav>
    </div>
  </header>
}
