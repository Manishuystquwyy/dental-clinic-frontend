import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function TreatmentCard({ service, index, detail = false }) {
  return <article className="g-treatment" id={`treatment-${index}`}><img src={service.imageSrc} alt={service.imageAlt} width="560" height="380" loading="lazy" decoding="async" /><div><span className="g-eyebrow">{String(index + 1).padStart(2, '0')} / DENTAL CARE</span><h3>{service.title}</h3><p>{service.what}</p>{detail ? <><p>{service.why}</p><Link to="/book">Discuss your treatment <ArrowUpRight size={16} /></Link></> : <Link to={`/services#treatment-${index}`}>Learn more <ArrowUpRight size={16} /></Link>}</div></article>
}
