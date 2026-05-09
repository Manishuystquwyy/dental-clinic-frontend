import { useState } from 'react'
import { createPublicRequest } from '../api/publicRequests'

function ServiceCard({ title, desc, kicker }) {
  return (
    <article className="home-service-card">
      <span className="home-service-kicker">{kicker}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  )
}

export default function Home() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const heroImage = '/images/dental-clinic-hero.webp'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validateForm() {
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError('Phone number must be a valid 10-digit mobile number.')
      return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validateForm()) return
    setSubmitting(true)

    try {
      await createPublicRequest({
        ...form,
        phone: form.phone.trim(),
        name: form.name.trim(),
        message: form.message.trim(),
        requestType: 'CONTACT',
      })
      setSuccess('Your request has been sent. We will contact you soon.')
      setForm({ name: '', phone: '', message: '' })
    } catch (err) {
      setError(err.message || 'Unable to send your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Modern Family Dentistry in Patna</span>
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
          <div className="hero-metrics">
            <div className="hero-metric">
              <strong>20+</strong>
              <span>Years of care</span>
            </div>
            <div className="hero-metric">
              <strong>Family</strong>
              <span>Friendly comfort</span>
            </div>
            <div className="hero-metric">
              <strong>Clear</strong>
              <span>Treatment guidance</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="photo-main">
            <img
              src={heroImage}
              alt="Dental clinic interior"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-floating-card">
            <span className="hero-floating-label">Why patients return</span>
            <p>Warm communication, modern treatment planning, and a calm clinic atmosphere.</p>
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
        <div className="section-head">
          <span className="eyebrow">Core Treatments</span>
          <h2>Our Services</h2>
          <p>Essential dental treatments delivered with a modern, reassuring approach.</p>
        </div>
        <div className="services-grid">
          <ServiceCard title="General Dentistry" kicker="Popular Care" desc="Cleanings, exams, fillings and preventive care." />
          <ServiceCard title="Cosmetic Dentistry" kicker="Smile Solution" desc="Teeth whitening, veneers, smile makeovers." />
          <ServiceCard title="Restorative Care" kicker="Core Treatment" desc="Crowns, bridges, implants and dentures." />
          <ServiceCard title="Orthodontics" kicker="Featured Service" desc="Clear aligners and braces for all ages." />
        </div>
      </section>

      <section className="signature">
        <div className="signature-panel signature-panel-featured">
          <img
            className="signature-panel-media signature-panel-media-featured"
            src="/images/service1.webp"
            alt="Modern dental consultation room"
            loading="lazy"
            decoding="async"
          />
          <div className="signature-panel-content">
            <h2>Signature Care Experience</h2>
            <p>Every visit is designed to feel reassuring, modern, and personalized.</p>
            <ul>
              <li>Care plans built around your goals and budget.</li>
              <li>Digital diagnostics for accurate treatment.</li>
              <li>Friendly follow-ups so you never feel alone.</li>
            </ul>
          </div>
        </div>
        <div className="signature-panel signature-panel-family">
          <img
            className="signature-panel-media signature-panel-media-family"
            src="/images/service11.webp"
            alt="Family-friendly dental care"
            loading="lazy"
            decoding="async"
          />
          <div className="signature-panel-content">
            <h2>Family-Friendly Atmosphere</h2>
            <p>We make kids and adults feel at ease from the moment you arrive.</p>
            <ul>
              <li>Warm welcome with clear next steps.</li>
              <li>Relaxed, clean, and well-lit treatment rooms.</li>
              <li>Trusted care for every age and smile.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="section-head">
          <span className="eyebrow">About The Clinic</span>
          <h2>About Gayatri Dental Clinic</h2>
        </div>
        <div className="about-card">
          <p>
            Gayatri Dental Clinic offers modern dental care in a friendly environment. Our experienced
            team focuses on patient comfort and long-term oral health.
          </p>
          <div className="about-highlights">
            <div>
              <strong>Patient-first care</strong>
              <span>Thoughtful treatment plans with comfort and clarity at every step.</span>
            </div>
            <div>
              <strong>Clean modern setting</strong>
              <span>Bright treatment spaces and up-to-date diagnostics for reliable care.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="section-head">
          <span className="eyebrow">Patient Feedback</span>
          <h2>What our patients say</h2>
        </div>
        <div className="test-grid">
          <blockquote>
            <p>"Very caring staff and great results — highly recommended."</p>
            <cite>Happy Patient</cite>
          </blockquote>
          <blockquote>
            <p>"Painless treatment and friendly atmosphere. My kids love it!"</p>
            <cite>Family Visit</cite>
          </blockquote>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="section-head">
          <span className="eyebrow">Quick Contact</span>
          <h2>Contact & Booking</h2>
        </div>
        <div className="contact-grid">
          <form onSubmit={handleSubmit} className="contact-form">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                maxLength="10"
                title="Enter a valid 10-digit mobile number"
                required
              />
            </label>
            <label>
              Message
              <textarea name="message" value={form.message} onChange={handleChange} required />
            </label>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
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
