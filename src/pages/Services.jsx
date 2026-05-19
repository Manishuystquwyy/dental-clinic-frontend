function ServiceCard({ title, what, why, className = '', imageSrc, imageAlt, mediaClassName = '' }) {
  return (
    <div className={`service-card ${className}`.trim()}>
      {imageSrc && (
        <img
          className={`service-card-media ${mediaClassName}`.trim()}
          src={imageSrc}
          alt={imageAlt || title}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="service-card-content">
        <h3>{title}</h3>
        <p className="service-what">{what}</p>
        <p className="service-why">{why}</p>
      </div>
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
          imageSrc="/images/service1.webp"
          imageAlt="Dental consultation and check-up"
          mediaClassName="service-card-media-featured"
        />
        <ServiceCard
          title="Dental Cleaning (Scaling & Polishing)"
          what="Removal of plaque, tartar, and stains from teeth, followed by polishing."
          why="Prevents gum disease, bad breath, and tooth decay."
          className="service-card-cleaning"
          imageSrc="/images/service2.webp"
          imageAlt="Professional dental cleaning"
        />
        <ServiceCard
          title="Tooth Filling"
          what="Repairing cavities by removing decayed tooth material and filling the space with composite or other materials."
          why="Stops decay from spreading and restores tooth strength."
          className="service-card-filling"
          imageSrc="/images/service3.webp"
          imageAlt="Tooth filling treatment"
        />
        <ServiceCard
          title="Root Canal Treatment (RCT)"
          what="Treatment to remove infected pulp inside the tooth and seal it to save the natural tooth."
          why="Relieves severe tooth pain and avoids tooth extraction."
          className="service-card-rct"
          imageSrc="/images/service4.webp"
          imageAlt="Root canal treatment"
        />
        <ServiceCard
          title="Tooth Extraction"
          what="Removal of severely damaged, decayed, or impacted teeth."
          why="Prevents infection from spreading to other teeth or gums."
          className="service-card-extraction"
          imageSrc="/images/service5.webp"
          imageAlt="Tooth extraction procedure"
        />
        <ServiceCard
          title="Dental Crowns & Bridges"
          what="Crowns cover damaged teeth; bridges replace missing teeth using adjacent teeth for support."
          why="Restores chewing ability, appearance, and tooth alignment."
          className="service-card-crowns"
          imageSrc="/images/service6.webp"
          imageAlt="Dental crowns and bridges"
        />
        <ServiceCard
          title="Dental Implants"
          what="Permanent replacement of missing teeth using titanium implants fixed into the jawbone."
          why="Looks, feels, and functions like natural teeth."
          className="service-card-implants"
          imageSrc="/images/service7.webp"
          imageAlt="Dental implant treatment"
        />
        <ServiceCard
          title="Teeth Whitening"
          what="Cosmetic procedure to lighten tooth color and remove stains."
          why="Improves smile appearance and confidence."
          className="service-card-whitening"
          imageSrc="/images/service8.webp"
          imageAlt="Teeth whitening treatment"
        />
        <ServiceCard
          title="Braces & Orthodontic Treatment"
          what="Corrects misaligned teeth and jaw using braces or aligners."
          why="Improves bite, speech, oral hygiene, and facial aesthetics."
          className="service-card-ortho"
          imageSrc="/images/service9.webp"
          imageAlt="Orthodontic braces treatment"
        />
        <ServiceCard
          title="Gum Treatment (Periodontics)"
          what="Treatment of gum infections, bleeding gums, and advanced gum disease."
          why="Healthy gums are essential for strong teeth and overall oral health."
          className="service-card-gum"
          imageSrc="/images/service10.webp"
          imageAlt="Gum treatment and periodontics"
        />
        <ServiceCard
          title="Pediatric Dentistry (Child Dental Care)"
          what="Specialized dental care for children, including preventive treatments."
          why="Builds healthy dental habits from an early age."
          className="service-card-pediatric"
          imageSrc="/images/service11.webp"
          imageAlt="Pediatric dental care"
        />
        <ServiceCard
          title="Dentures (Full & Partial)"
          what="Removable artificial teeth for patients with multiple missing teeth."
          why="Restores speech, chewing, and facial structure."
          className="service-card-dentures"
          imageSrc="/images/service12.webp"
          imageAlt="Dentures and restorative dental care"
        />
      </div>
    </section>
  )
}
