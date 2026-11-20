export function isValidAppointmentPolicy(policy) {
  return Boolean(policy && typeof policy === 'object' && !Array.isArray(policy)
    && ['cancellationCutoffHours', 'rescheduleCutoffHours'].every((field) => (
      Number.isSafeInteger(policy[field]) && policy[field] >= 0
    )))
}
