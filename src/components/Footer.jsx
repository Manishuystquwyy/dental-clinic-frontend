import { Link } from 'react-router-dom'
import { clinic } from '../data/clinic'
export default function Footer() {
  return <footer className="g-footer"><div className="g-container g-footer-grid">
    <div><Link to="/" className="g-footer-brand">Gayatri<span>Dental Clinic</span></Link><p>Thoughtful care for every chapter<br />of your smile.</p><a href={`mailto:${clinic.email}`}>Let’s connect ↗</a></div>
    <div><h3>Explore</h3><Link to="/about">About us</Link><Link to="/doctors">Our dentists</Link><Link to="/#smiles">Smile transformations</Link><Link to="/book">Book an appointment</Link></div>
    <div><h3>Treatments</h3><Link to="/services#treatment-3">Root canal treatment</Link><Link to="/services#treatment-6">Dental implants</Link><Link to="/services#treatment-8">Braces & orthodontics</Link><Link to="/services">All treatments</Link></div>
    <div><h3>Visit & connect</h3><p>{clinic.address}</p><a href={clinic.phoneHref}>{clinic.phone}</a><a href={`mailto:${clinic.email}`}>{clinic.email}</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapQuery)}`} target="_blank" rel="noreferrer">Find us on Google Maps ↗</a></div>
    </div><div className="g-container g-footer-bottom"><span>© {new Date().getFullYear()} Gayatri Dental Clinic. All rights reserved.</span><div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link></div></div></footer>
}
