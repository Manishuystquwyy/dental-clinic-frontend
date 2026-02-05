import { useState } from 'react'
import Hero from '../assets/image.png'

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
          <h2>Your trusted family dentist</h2>
          <p>Preventive, cosmetic and restorative dentistry with gentle care.</p>
          <a href="#contact" className="primary">Book an appointment</a>
        </div>
        <div className="hero-image">
          <img src={Hero} alt="Dentist caring for patient" />
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
            <p>123 Main Street, Your City</p>
            <p>Phone: +91 98765 43210</p>
            <p>Email: info@gayatridental.com</p>
          </div>
        </div>
      </section>
    </>
  )
}
