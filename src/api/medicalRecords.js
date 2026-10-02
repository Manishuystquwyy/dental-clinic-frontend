import { apiFetch } from './client'

export function getMyMedicalRecords() {
  return apiFetch('/medical-records/mine', { cache: 'no-store' })
}

export function getAppointmentMedicalRecords(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/medical-records`, { cache: 'no-store' })
}

export function createPrescription(appointmentId, payload) {
  return apiFetch(`/appointments/${appointmentId}/medical-records/prescription`, {
    method: 'POST', body: JSON.stringify(payload),
  })
}

export function uploadMedicalDocument(appointmentId, formData) {
  return apiFetch(`/appointments/${appointmentId}/medical-records/documents`, {
    method: 'POST', body: formData,
  })
}

export function getMedicalRecordFile(id) {
  return apiFetch(`/medical-records/${id}/file`, { responseType: 'blob', cache: 'no-store' })
}
