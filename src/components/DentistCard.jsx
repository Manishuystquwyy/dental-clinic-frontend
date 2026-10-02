import { resolvePictureUrl } from '../utils/media'
import { Button } from './ui'
export default function DentistCard({ doctor }) {
  return <article className="g-dentist"><div className="g-dentist-photo"><span aria-hidden="true">{doctor.name?.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>{doctor.pictureUrl && <img src={resolvePictureUrl(doctor.pictureUrl)} alt={doctor.name} width="420" height="420" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} />}</div><div className="g-dentist-body"><span className="g-eyebrow">{doctor.specialization || 'Dental care'}</span><h3>{doctor.name}</h3><p>{doctor.qualification}{doctor.experienceYears != null && ` · ${doctor.experienceYears} years of experience`}</p>{doctor.description && <p>{doctor.description}</p>}<div className="g-actions"><Button variant="outline" to={`/doctors/${doctor.id}`}>View Profile</Button><Button to={`/doctors/${doctor.id}#booking`}>Book Appointment</Button></div></div></article>
}
