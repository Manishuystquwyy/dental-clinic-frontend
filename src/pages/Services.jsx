function ServiceCard({ title, what, why, className = '' }) {
  return (
    <div className={`service-card ${className}`.trim()}>
      <h3>{title}</h3>
      <p className="service-what">{what}</p>
      <p className="service-why">{why}</p>
    </div>
  )
}

export default function Services() {
  return (
    <section className="services-page services">
      <div className="section-head">
        <h2>Our Services</h2>
        <p>Complete dental care with clear guidance on what each treatment does and why it matters.</p>
      </div>
      <div className="services-grid">
        <ServiceCard
          title="General Dental Check-up & Consultation"
          what="A routine examination of teeth, gums, and mouth to detect cavities, gum disease, or other oral issues early."
          why="Early diagnosis prevents pain, infection, and costly treatments later."
          className="service-card-featured"
        />
        <ServiceCard
          title="Dental Cleaning (Scaling & Polishing)"
          what="Removal of plaque, tartar, and stains from teeth, followed by polishing."
          why="Prevents gum disease, bad breath, and tooth decay."
          className="service-card-cleaning"
        />
        <ServiceCard
          title="Tooth Filling"
          what="Repairing cavities by removing decayed tooth material and filling the space with composite or other materials."
          why="Stops decay from spreading and restores tooth strength."
          className="service-card-filling"
        />
        <ServiceCard
          title="Root Canal Treatment (RCT)"
          what="Treatment to remove infected pulp inside the tooth and seal it to save the natural tooth."
          why="Relieves severe tooth pain and avoids tooth extraction."
          className="service-card-rct"
        />
        <ServiceCard
          title="Tooth Extraction"
          what="Removal of severely damaged, decayed, or impacted teeth."
          why="Prevents infection from spreading to other teeth or gums."
          className="service-card-extraction"
        />
        <ServiceCard
          title="Dental Crowns & Bridges"
          what="Crowns cover damaged teeth; bridges replace missing teeth using adjacent teeth for support."
          why="Restores chewing ability, appearance, and tooth alignment."
          className="service-card-crowns"
        />
        <ServiceCard
          title="Dental Implants"
          what="Permanent replacement of missing teeth using titanium implants fixed into the jawbone."
          why="Looks, feels, and functions like natural teeth."
          className="service-card-implants"
        />
        <ServiceCard
          title="Teeth Whitening"
          what="Cosmetic procedure to lighten tooth color and remove stains."
          why="Improves smile appearance and confidence."
          className="service-card-whitening"
        />
        <ServiceCard
          title="Braces & Orthodontic Treatment"
          what="Corrects misaligned teeth and jaw using braces or aligners."
          why="Improves bite, speech, oral hygiene, and facial aesthetics."
          className="service-card-ortho"
        />
        <ServiceCard
          title="Gum Treatment (Periodontics)"
          what="Treatment of gum infections, bleeding gums, and advanced gum disease."
          why="Healthy gums are essential for strong teeth and overall oral health."
          className="service-card-gum"
        />
        <ServiceCard
          title="Pediatric Dentistry (Child Dental Care)"
          what="Specialized dental care for children, including preventive treatments."
          why="Builds healthy dental habits from an early age."
          className="service-card-pediatric"
        />
        <ServiceCard
          title="Dentures (Full & Partial)"
          what="Removable artificial teeth for patients with multiple missing teeth."
          why="Restores speech, chewing, and facial structure."
          className="service-card-dentures"
        />
      </div>
    </section>
  )
}
