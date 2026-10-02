import { ArrowUpRight, Heart, ShieldCheck, Sparkles, Phone, ScanLine, ClipboardList, CalendarCheck, HeartHandshake, Quote, Star } from 'lucide-react'
import { Button, SectionHeading, LoadingSkeleton } from '../ui'
import DentistCard from '../DentistCard'
import TreatmentCard from '../TreatmentCard'
import { services } from '../../data/services'
import { clinic, testimonials, smileCases } from '../../data/clinic'
export function HeroSection() {
  return <section className="g-hero"><div className="g-container g-hero-grid"><div className="g-hero-copy"><span className="g-eyebrow"><span className="g-dot" /> FAMILY DENTISTRY IN PATNA</span><h1>Healthy Smiles.<br /><em>Expert Care.</em></h1><p>Advanced, comfortable and personalized dental care for you and your family.</p><div className="g-actions"><Button to="/book">Book Appointment</Button><Button to="/services" variant="outline">Explore Treatments</Button></div><div className="g-hero-note"><ShieldCheck size={22} /><span>A little reassurance.<br /><strong>A lifetime of healthier smiles.</strong></span></div></div><div className="g-hero-image"><img src="/images/clinic-1200.webp" srcSet="/images/clinic-640.webp 640w, /images/clinic-1200.webp 1200w, /images/dental-clinic-hero.webp 2200w" sizes="(max-width: 760px) 100vw, 55vw" width="1200" height="800" fetchPriority="high" alt="A bright, welcoming dental treatment room" /><div className="g-image-note"><Heart size={25} /><div>Care that feels personal<small>From your first hello to your follow-up.</small></div><ArrowUpRight size={22} /></div><span className="g-image-caption">A CALMER APPROACH TO DENTISTRY</span></div></div></section>
}
export function StatsSection({ doctors, loading }) {
  return <section className="g-trust g-container" aria-label="Our care priorities"><div><strong>{!loading && doctors.length ? String(doctors.length).padStart(2, '0') : <HeartHandshake />}</strong><span>Our dental team<small>Personal attention, every visit</small></span></div><div><strong><Heart /></strong><span>Patient comfort<small>Your concerns come first</small></span></div><div><strong>{services.length}</strong><span>Treatment options<small>Care for every stage of life</small></span></div><div><strong><ShieldCheck /></strong><span>Thoughtful care<small>Clear guidance at each step</small></span></div></section>
}
export function AboutSection() {
  return <section className="g-section g-container g-about" id="about"><div className="g-about-media"><img src="/images/service1.webp" width="600" height="620" loading="lazy" alt="Dental examination and consultation" /><span>YOUR COMFORT. OUR PRIORITY.</span></div><div><SectionHeading eyebrow="WELCOME TO GAYATRI" title="Experience a new standard of dental care">Good dentistry starts with listening. We take time to understand your concerns, explain your options, and help you feel at home in the dental chair.</SectionHeading><p>From routine check-ups to restorative care, our approach brings modern dentistry and personalized treatment together—with your comfort at the centre.</p><div className="g-values"><span><Sparkles /> Modern treatment planning</span><span><Heart /> Gentle, personal attention</span><span><ShieldCheck /> Clear conversations about your care</span></div><Button to="/about" variant="outline">Get to know us</Button></div></section>
}
export function TreatmentsSection() {
  return <section className="g-section g-treatments-section" id="treatments"><div className="g-container"><div className="g-section-row"><SectionHeading eyebrow="CARE FOR EVERY SMILE" title="Your smile. Your kind of care.">Every smile has different needs. Find the right place to begin.</SectionHeading><Button to="/services" variant="outline">View all treatments</Button></div><div className="g-treatment-grid">{[3,6,1,8,7,4,10,5].map(i => <TreatmentCard key={i} index={i} service={services[i]} />)}</div></div></section>
}
export function SmileGallery({ cases = smileCases }) {
  return (
    <section className="g-section g-container" id="smiles" aria-label="Before and after gallery">
      <div className="g-section-row">
        <SectionHeading eyebrow="BEFORE & AFTER GALLERY" title="Every smile has a story.">
          Thoughtful treatment, planned around the person behind the smile.
        </SectionHeading>
        <Button to="/book" variant="outline">Explore your options</Button>
      </div>
      <div className="g-smile-grid">
        {cases.length ? cases.map(item => (
          <article className="g-case" key={item.id}>
            {item.image ? (
              <figure className="g-case-photo">
                <a href={item.image} target="_blank" rel="noopener noreferrer" aria-label="View full before and after photograph (opens in a new tab)">
                  <img src={item.image} alt={item.imageAlt} width="1272" height="1575" loading="lazy" decoding="async" />
                </a>
                <figcaption>Before & after <a href={item.image} target="_blank" rel="noopener noreferrer">View full photo <ArrowUpRight size={14} aria-hidden="true" /><span className="g-sr-only"> (opens in a new tab)</span></a></figcaption>
              </figure>
            ) : (
              <div className="g-case-pair">
                {['before', 'after'].map(phase => (
                  <figure key={phase}>
                    <img src={item[phase]} alt={`${phase} ${item.title}`} width="500" height="350" loading="lazy" />
                    <figcaption>{phase}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <div className="g-case-story">
              <span className="g-eyebrow">A PATIENT’S SMILE JOURNEY</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ol className="g-case-stages">
                <li><span>01</span><div><h4>Before treatment</h4><p>Where the smile journey began.</p></div></li>
                <li><span>02</span><div><h4>After treatment</h4><p>A closer look at the final smile.</p></div></li>
              </ol>
              <Button to="/book" variant="outline">Start your smile journey</Button>
              <small>Every smile is unique. Treatment options and results vary for each patient.</small>
            </div>
          </article>
        )) : (
          <div className="g-gallery-empty"><ScanLine size={42} strokeWidth={1} /><div><h3>Real smiles deserve real stories.</h3><p>Our before & after gallery is coming soon. Only patient-approved treatment photographs will be featured here.</p></div><span>BEFORE & AFTER<br />GALLERY COMING SOON</span></div>
        )}
      </div>
    </section>
  )
}
export function WhyChooseUs() {
  const steps = [[<ScanLine size={28} strokeWidth={1.3} />,'Consultation & diagnosis','We listen to your concerns and assess your oral health.'],[<ClipboardList size={28} strokeWidth={1.3} />,'A plan made for you','Understand your options, treatment stages, and pricing.'],[<CalendarCheck size={28} strokeWidth={1.3} />,'Your appointment','Choose an available slot and take the next step with your dentist.'],[<HeartHandshake size={28} strokeWidth={1.3} />,'Care that continues','Get guidance for recovery and long-term oral health.']]
  return <section className="g-journey g-section"><div className="g-container"><SectionHeading eyebrow="WITH YOU, EVERY STEP" title="A clear path to a healthier smile.">Knowing what comes next makes all the difference.</SectionHeading><div className="g-step-grid">{steps.map(([icon,title,copy],i) => <article key={title}><div>{icon}<span>0{i+1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
}
export function DentistSection({ doctors, loading, error, all = false }) {
  return <section className="g-section g-container"><div className="g-section-row"><SectionHeading eyebrow="THE PEOPLE BEHIND YOUR CARE" title="Expert hands. A human touch.">Get to know the dentists who will guide your care.</SectionHeading>{!all && <Button to="/doctors" variant="outline">Meet our dentists</Button>}</div>{loading ? <LoadingSkeleton /> : error ? <p className="g-empty" role="status">{error} <a href={clinic.phoneHref}>Call {clinic.phone}</a></p> : doctors.length ? <div className="g-dentist-grid">{(all ? doctors : doctors.slice(0,3)).map(d => <DentistCard key={d.id} doctor={d} />)}</div> : <p className="g-empty">Our dentist profiles will be available soon. Please call us to discuss your visit.</p>}</section>
}
export function AppointmentCTA() {
  return <section className="g-appointment g-container"><div><span className="g-eyebrow">LET’S TAKE THE FIRST STEP</span><h2>Ready for a<br /><em>healthier smile?</em></h2><p>Book your consultation with Gayatri Dental Clinic today.</p></div><div className="g-appointment-actions"><Button to="/book">Book Appointment</Button><a href={clinic.phoneHref}><Phone size={18} /> Call Clinic · {clinic.phone}</a><small>We’re here to help you feel at ease.</small></div></section>
}
export function TestimonialCard({ testimonial }) {
  return <blockquote className="g-review"><Quote size={28} /><div aria-label={`${testimonial.rating} out of 5 stars`}>{Array.from({length: Math.max(0, Math.min(5, Math.round(testimonial.rating)))},(_,i) => <Star key={i} size={15} fill="currentColor" />)}</div><p>{testimonial.review}</p><footer>{testimonial.image && <img src={testimonial.image} alt="" width="40" height="40" loading="lazy" />}<cite>{testimonial.name}</cite></footer></blockquote>
}
export function TestimonialsSection() {
  return <section className="g-section g-container g-testimonials"><SectionHeading eyebrow="PATIENT VOICES" title="Care worth talking about." />{testimonials.length ? <div className="g-review-grid">{testimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)}</div> : <div className="g-review-empty"><Quote size={32} strokeWidth={1} /><p>Your experience matters to us.</p><span>Patient reviews will appear here once shared with permission.</span><Button to="/contact" variant="outline">Share your experience</Button></div>}</section>
}
export function ContactSection() {
  return <section className="g-contact g-section" id="contact"><div className="g-container g-contact-grid"><div><SectionHeading eyebrow="WE’D LOVE TO WELCOME YOU" title="Your neighbourhood. Your dental clinic." /><p>{clinic.address}</p><a href={clinic.phoneHref}>{clinic.phone}</a><a href={`mailto:${clinic.email}`}>{clinic.email}</a><h3>Opening hours</h3><p>{clinic.hours}</p><div className="g-actions"><Button to="/contact">Contact us</Button><Button variant="outline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapQuery)}`}>Get directions</Button></div></div><iframe title="Find Gayatri Dental Clinic in Kurthaul, Patna" src={`https://www.google.com/maps?q=${encodeURIComponent(clinic.mapQuery)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>
}
