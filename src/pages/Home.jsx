import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useDentists from '../hooks/useDentists'
import { HeroSection, StatsSection, AboutSection, TreatmentsSection, SmileGallery, WhyChooseUs, DentistSection, AppointmentCTA, TestimonialsSection, ContactSection } from '../components/home/CareSections'
export default function Home() {
  const team = useDentists()
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView() }, [hash])
  return <div className="g-home"><HeroSection /><StatsSection {...team} /><AboutSection /><TreatmentsSection /><SmileGallery /><WhyChooseUs /><DentistSection {...team} /><AppointmentCTA /><TestimonialsSection /><ContactSection /></div>
}
