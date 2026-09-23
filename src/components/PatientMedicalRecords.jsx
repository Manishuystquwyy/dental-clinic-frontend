import { useEffect, useState } from 'react'
import { getMyMedicalRecords } from '../api/medicalRecords'
import MedicalRecordList from './MedicalRecordList'
import { recordTypeLabels } from '../utils/medicalRecords'

export default function PatientMedicalRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [type, setType] = useState('ALL')

  useEffect(() => {
    let active = true
    getMyMedicalRecords().then((data) => { if (active) setRecords(data) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  function refresh() {
    setError(''); setLoading(true); setReload((value) => value + 1)
  }

  return <section className="medical-records-panel" aria-labelledby="patient-records-heading">
    <div className="records-section-heading">
      <div><h3 id="patient-records-heading">My prescriptions &amp; reports</h3><p>Your prescriptions, X-rays and documents, saved for future reference.</p></div>
      <button className="record-button secondary" type="button" onClick={refresh} disabled={loading}>Refresh</button>
    </div>
    <div className="record-filters"><label htmlFor="patient-record-type">Show</label>
      <select id="patient-record-type" value={type} onChange={(event) => setType(event.target.value)}>
        <option value="ALL">All records</option>
        {Object.entries(recordTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </div>
    <MedicalRecordList records={records.filter((record) => type === 'ALL' || record.type === type)} loading={loading} error={error} onRetry={refresh}
      emptyMessage={type === 'ALL' ? 'Your doctor has not shared any prescriptions or reports yet.' : 'No records of this type yet.'} />
  </section>
}
