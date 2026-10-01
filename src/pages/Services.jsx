import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { services } from '../data/services'
import TreatmentCard from '../components/TreatmentCard'
import { SectionHeading } from '../components/ui'
export default function Services() {
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView() }, [hash])
  return <section className="g-section g-container"><SectionHeading eyebrow="OUR TREATMENTS" title="Good care, for every kind of smile.">Explore your options with clear, practical guidance. Your dentist will recommend a plan after a consultation.</SectionHeading><div className="g-treatment-grid">{services.map((s,i) => <TreatmentCard key={s.title} service={s} index={i} detail />)}</div></section>
}
