import { useState } from 'react'

function ServiceCard({ title, desc }) {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

export default function Home() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const heroImage = '/images/dental-clinic-hero.jpg'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    alert('Thanks, ' + (form.name || 'there') + '! We will contact you soon.')
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="hero-badge">Gentle Care Promise</span>
            <span className="hero-badge">Modern Equipment</span>
            <span className="hero-badge">Same-Day Relief</span>
          </div>
          <h2>Your most confident smile starts here.</h2>
          <p>Preventive, cosmetic and restorative dentistry with a calm, welcoming experience for the whole family.</p>
          <div className="hero-actions">
            <a href="/book" className="primary">Book an appointment</a>
            <a href="#contact" className="secondary">Ask a question</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="photo-main">
            <img src={heroImage} alt="Dental clinic interior" />
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-card">
          <h4>20+ Years of Care</h4>
          <p>Trusted by generations of families in the community.</p>
        </div>
        <div className="trust-card">
          <h4>Comfort-First Visits</h4>
          <p>Calm rooms, gentle treatment, and transparent plans.</p>
        </div>
        <div className="trust-card">
          <h4>Flexible Scheduling</h4>
          <p>Morning and evening appointments to fit your day.</p>
        </div>
      </section>

      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <ServiceCard title="General Dentistry" desc="Cleanings, exams, fillings and preventive care." />
          <ServiceCard title="Cosmetic Dentistry" desc="Teeth whitening, veneers, smile makeovers." />
          <ServiceCard title="Restorative Care" desc="Crowns, bridges, implants and dentures." />
          <ServiceCard title="Orthodontics" desc="Clear aligners and braces for all ages." />
        </div>
      </section>

      <section className="signature">
        <div className="signature-panel signature-panel-featured">
          <h2>Signature Care Experience</h2>
          <p>Every visit is designed to feel reassuring, modern, and personalized.</p>
          <ul>
            <li>Care plans built around your goals and budget.</li>
            <li>Digital diagnostics for accurate treatment.</li>
            <li>Friendly follow-ups so you never feel alone.</li>
          </ul>
        </div>
        <div className="signature-panel signature-panel-family">
          <h2>Family-Friendly Atmosphere</h2>
          <p>We make kids and adults feel at ease from the moment you arrive.</p>
          <ul>
            <li>Warm welcome with clear next steps.</li>
            <li>Relaxed, clean, and well-lit treatment rooms.</li>
            <li>Trusted care for every age and smile.</li>
          </ul>
        </div>
      </section>

      <section id="about" className="about">
        <h2>About Gayatri Dental Clinic</h2>
        <p>
          Gayatri Dental Clinic offers modern dental care in a friendly environment. Our experienced
          team focuses on patient comfort and long-term oral health.
        </p>
      </section>

      <section id="testimonials" className="testimonials">
        <h2>What our patients say</h2>
        <div className="test-grid">
          <blockquote>"Very caring staff and great results — highly recommended."</blockquote>
          <blockquote>"Painless treatment and friendly atmosphere. My kids love it!"</blockquote>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contact & Booking</h2>
        <div className="contact-grid">
          <form onSubmit={handleSubmit} className="contact-form">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              Message
              <textarea name="message" value={form.message} onChange={handleChange} />
            </label>
            <button type="submit" className="primary">Send Request</button>
          </form>

          <div className="contact-info">
            <h3>Gayatri Dental Clinic</h3>
            <p>1st Floor, Pillar No: 44, Near Union Bank,</p>
            <p>Kurthaul, Patna</p>
            <p>Phone: +91 7739280958</p>
            <p>Email: info@gayatridental.com</p>
          </div>
        </div>
      </section>
    </>
  )
}
