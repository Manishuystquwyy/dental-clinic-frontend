import { useLocation, Link } from 'react-router-dom'
export default function Legal() {
  const privacy = useLocation().pathname === '/privacy'
  return <section className="g-section g-container g-legal"><span className="g-eyebrow">PATIENT INFORMATION</span><h1>{privacy ? 'Privacy Policy' : 'Terms & Conditions'}</h1><p>{privacy ? 'The clinic’s formal privacy policy is awaiting publication. Please contact the clinic with questions about how your personal information is handled.' : 'The clinic’s formal terms and conditions are awaiting publication. Please confirm treatment, pricing, cancellation, and refund conditions with the clinic before booking.'}</p><Link to="/contact" className="g-button g-button-primary">Contact the clinic</Link></section>
}
