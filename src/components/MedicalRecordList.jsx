import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getMedicalRecordFile } from '../api/medicalRecords'
import { recordTypeLabels } from '../utils/medicalRecords'
import MedicalPdfPreview from './MedicalPdfPreview'
import './MedicalRecords.css'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

async function downloadRecord(record) {
  const blob = await getMedicalRecordFile(record.id)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = record.fileName || `prescription-${record.id}.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Give the browser time to start reading the download before releasing it.
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

function RecordViewer({ record, onClose }) {
  const dialogRef = useRef(null)
  const [fileUrl, setFileUrl] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  useEffect(() => {
    if (!record.fileName) return
    let active = true
    let url
    getMedicalRecordFile(record.id).then((blob) => {
      if (!active) return
      url = URL.createObjectURL(blob)
      setFileUrl(url)
    }).catch((err) => { if (active) setError(err.message || 'Unable to load document.') })
    return () => {
      active = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [record.id, record.fileName])

  async function download() {
    setBusy(true)
    setError('')
    try { await downloadRecord(record) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return createPortal(
    <dialog className="medical-record-dialog" ref={dialogRef} aria-labelledby="record-view-title" onCancel={onClose}>
      <div className="record-view-toolbar">
        <span>{recordTypeLabels[record.type]}</span>
        <button type="button" className="record-button secondary" onClick={onClose} autoFocus>Close</button>
      </div>
      <div className="prescription-sheet">
        <p className="record-clinic-name">Gayatri Dental Clinic</p>
        <h2 id="record-view-title">{record.title}</h2>
        <div className="record-patient-details">
          <p><strong>Patient:</strong> {record.patientName}</p>
          <p><strong>Doctor:</strong> {record.doctorName}</p>
          <p><strong>Visit:</strong> {formatDate(record.appointmentDate)}</p>
          <p><strong>Issued:</strong> {formatDate(record.createdAt)} · Record #{record.id}</p>
        </div>
        {record.prescriptionText && <div className="prescription-content">{record.prescriptionText}</div>}
        {record.notes && <div className="record-notes"><h3>Additional advice / follow-up</h3><p>{record.notes}</p></div>}
        {record.fileName && <div className="record-file-preview">
          <p>{record.fileName}</p>
          {!fileUrl && !error && <p role="status">Loading document…</p>}
          {fileUrl && (record.contentType === 'application/pdf'
            ? <MedicalPdfPreview url={fileUrl} />
            : <img src={fileUrl} alt={record.title} />)}
        </div>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="record-view-actions">
        <button className="record-button" type="button" onClick={download} disabled={busy}>
          {busy ? 'Downloading…' : record.fileName ? 'Download file' : 'Download prescription (.txt)'}
        </button>
        {record.prescriptionText && <button className="record-button secondary" type="button" onClick={() => window.print()}>Print / Save as PDF</button>}
      </div>
    </dialog>, document.body,
  )
}

export default function MedicalRecordList({ records, loading, error, onRetry, emptyMessage = 'No prescriptions or reports have been shared yet.' }) {
  const [viewing, setViewing] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [downloadError, setDownloadError] = useState('')

  async function download(record) {
    setBusyId(record.id)
    setDownloadError('')
    try { await downloadRecord(record) } catch (err) { setDownloadError(err.message) } finally { setBusyId(null) }
  }

  return <div className="medical-record-list" aria-busy={loading}>
    {loading && <p role="status">Loading prescriptions and reports…</p>}
    {error && <div role="alert" className="form-error">{error} {onRetry && <button className="record-button secondary" type="button" onClick={onRetry}>Retry</button>}</div>}
    {downloadError && <p className="form-error" role="alert">{downloadError}</p>}
    {!loading && !error && records.length === 0 && <p className="records-empty">{emptyMessage}</p>}
    {records.map((record) => <article className="medical-record-card" key={record.id}>
      <div className="record-card-body">
        <span className={`record-kind kind-${record.type.toLowerCase()}`}>{recordTypeLabels[record.type]}</span>
        <h4>{record.title}</h4>
        <p>{record.doctorName} · Visit {formatDate(record.appointmentDate)}</p>
        <p>Shared {formatDate(record.createdAt)}{record.fileSize ? ` · ${(record.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}</p>
        {record.fileName && <p className="record-file-name">{record.fileName}</p>}
      </div>
      <div className="record-card-actions">
        <button className="record-button secondary" type="button" onClick={() => setViewing(record)} aria-label={`View ${record.title}`}>View</button>
        <button className="record-button" type="button" onClick={() => download(record)} disabled={busyId !== null} aria-label={`Download ${record.title}`}>
          {busyId === record.id ? 'Downloading…' : 'Download'}
        </button>
      </div>
    </article>)}
    {viewing && <RecordViewer key={viewing.id} record={viewing} onClose={() => setViewing(null)} />}
  </div>
}
