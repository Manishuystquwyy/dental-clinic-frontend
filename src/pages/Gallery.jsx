export default function Gallery() {
  const heroImage = '/images/dental-clinic-hero.jpg'
  return (
    <section className="gallery-page">
      <h2>Gallery</h2>
      <p>Bright spaces, modern care, and smiles we are proud of.</p>
      <div className="gallery-grid">
        <div className="gallery-card">
          <img src={heroImage} alt="Clinic interior" />
          <div className="caption">Comfort-first operatories</div>
        </div>
        <div className="gallery-card">
          <img src={SmileImage} alt="Smiling patient" />
          <div className="caption">Modern tools & hygiene</div>
        </div>
        <div className="gallery-card">
          <img src={heroImage} alt="Welcome desk" />
          <div className="caption">A warm welcome every visit</div>
        </div>
        <div className="gallery-card">
          <img src={heroImage} alt="Happy patient" />
          <div className="caption">Smiles that last</div>
        </div>
      </div>
    </section>
  )
}
