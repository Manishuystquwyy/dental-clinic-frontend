import useDentists from '../hooks/useDentists'
import { DentistSection } from '../components/home/CareSections'
export default function Doctors() { return <DentistSection {...useDentists()} all /> }
