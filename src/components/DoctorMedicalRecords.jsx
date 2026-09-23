import { useEffect, useState } from 'react'
import { createPrescription, getAppointmentMedicalRecords, uploadMedicalDocument } from '../api/medicalRecords'
import MedicalRecordList from './MedicalRecordList'
import { recordTypeLabels } from '../utils/medicalRecords'

export default function DoctorMedicalRecords({ appointment, onClose }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reload, setReload] = useState(0)
  const [mode, setMode] = useState('prescription')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    getAppointmentMedicalRecords(appointment.id).then((data) => {
      if (active) setRecords(data)
    }).catch((err) => { if (active) setLoadError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [appointment.id, reload])

  async function save(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setSaveError('')
    setSuccess('')
    if (!data.get('title')?.trim() || (mode === 'prescription' && !data.get('prescriptionText')?.trim())) {
      setSaveError('Enter a title and prescription details before sharing.')
      return
    }
    if (mode === 'upload') {
      const file = data.get('file')
      if (!file?.size || file.size > 10 * 1024 * 1024) {
        setSaveError('Choose a non-empty PDF, PNG or JPEG file up to 10 MB.')
        return
      }
    }
    setSaving(true)
    try {
      const saved = mode === 'prescription'
        ? await createPrescription(appointment.id, Object.fromEntries(data))
        : await uploadMedicalDocument(appointment.id, data)
      setRecords((previous) => [saved, ...previous])
      setSuccess('Saved and shared. The patient can now view and download this record from their dashboard.')
      form.reset()
    } catch (err) {
      setSaveError(err.message || 'Unable to save this record. Your entries have been kept.')
    } finally {
      setSaving(false)
    }
  }

  return <section className="medical-records-panel doctor-records-panel" aria-labelledby="doctor-records-heading">
    <div className="records-section-heading">
      <div><h3 id="doctor-records-heading">Prescriptions &amp; reports</h3>
        <p>{appointment.patientName || `Patient #${appointment.patientId}`} · {appointment.appointmentDate} · {appointment.appointmentTime}</p></div>
      <button className="record-button secondary" type="button" onClick={onClose} disabled={saving}>Close records</button>
    </div>
    {appointment.status !== 'CANCELLED' ? <>
      <div className="record-mode-switch" role="group" aria-label="Record format">
        <button className={`record-button ${mode === 'prescription' ? '' : 'secondary'}`} type="button" aria-pressed={mode === 'prescription'} onClick={() => setMode('prescription')} disabled={saving}>Write prescription</button>
        <button className={`record-button ${mode === 'upload' ? '' : 'secondary'}`} type="button" aria-pressed={mode === 'upload'} onClick={() => setMode('upload')} disabled={saving}>Upload document / X-ray</button>
      </div>
      <form className="medical-record-form" onSubmit={save} key={mode}>
        <fieldset disabled={saving}>
          <label htmlFor="record-title">Title</label>
          <input id="record-title" name="title" required maxLength={160} placeholder={mode === 'prescription' ? 'Prescription for this visit' : 'e.g. Dental X-ray report'} />
          {mode === 'prescription' ? <>
            <label htmlFor="prescription-text">Prescription details</label>
            <p className="record-field-help" id="prescription-help">Include the medicine name, dosage, frequency, duration and instructions for each medicine.</p>
            <textarea id="prescription-text" name="prescriptionText" required maxLength={12000} rows={9} aria-describedby="prescription-help" />
          </> : <>
            <label htmlFor="record-type">Document type</label>
            <select id="record-type" name="type" defaultValue="REPORT">{Object.entries(recordTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <label htmlFor="record-file">File</label>
            <input id="record-file" name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" aria-describedby="file-help" />
            <p className="record-field-help" id="file-help">PDF, PNG or JPEG · Maximum 10 MB. Export X-rays to one of these formats before uploading.</p>
          </>}
          <label htmlFor="record-notes">Additional advice / follow-up <span>(optional)</span></label>
          <textarea id="record-notes" name="notes" maxLength={2000} rows={3} />
          <p className="record-field-help">Saving shares the record with this patient immediately. To correct a shared record, add a new record explaining the correction.</p>
          <button className="record-button" type="submit" disabled={saving || loading || Boolean(loadError)}>{saving ? 'Saving…' : 'Save & share with patient'}</button>
        </fieldset>
      </form>
    </> : <p>View existing records below. New records cannot be added to a cancelled appointment.</p>}
    {saveError && <p className="form-error" role="alert">{saveError}</p>}
    {success && <p className="record-success" role="status">{success}</p>}
    <h4>Shared records</h4>
    <MedicalRecordList records={records} loading={loading} error={loadError} onRetry={() => {
      setLoadError(''); setLoading(true); setReload((value) => value + 1)
    }} />
  </section>
}
