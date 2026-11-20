import { CircleCheck, Clock3, CircleAlert, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cancelledPaymentMessage, formatRefundAmount, formatRefundTimestamp, getRefundPresentation } from '../utils/refundPresentation'
import './AppointmentRefund.css'

const steps = ['Requested', 'Processing', 'Processed']

export default function AppointmentRefund({ appointment }) {
  const refunds = appointment.refunds || []
  if (refunds.length === 0) {
    if (appointment.status !== 'CANCELLED') return null
    return (
      <div className="appointment-refund-note">
        <p>{cancelledPaymentMessage(appointment)}</p>
        {['SUCCESS', 'PENDING'].includes(appointment.paymentStatus) && <Link to="/contact">Contact the clinic <ArrowUpRight size={14} aria-hidden="true" /></Link>}
      </div>
    )
  }

  return (
    <div className="appointment-refunds" aria-label="Refund tracking">
      {refunds.map((refund, index) => {
        const presentation = getRefundPresentation(refund.status)
        const amount = formatRefundAmount(refund.amount)
        const requestedAt = formatRefundTimestamp(refund.requestedAt)
        const completedAt = formatRefundTimestamp(refund.completedAt)
        const StatusIcon = presentation.tone === 'completed' ? CircleCheck
          : presentation.tone === 'failed' ? CircleAlert : Clock3
        return (
          <section className={`appointment-refund appointment-refund--${presentation.tone}`} key={refund.paymentId || refund.refundId || index}>
            <div className="appointment-refund-header">
              <div>
                <span className="appointment-refund-label">{refunds.length > 1 ? `Refund ${index + 1}` : 'Your refund'}</span>
                {amount && <strong className="appointment-refund-amount">{amount}</strong>}
              </div>
              <span className="appointment-refund-status"><StatusIcon size={15} aria-hidden="true" />{presentation.label}</span>
            </div>
            {presentation.step >= 0 && (
              <ol className="appointment-refund-progress" aria-label="Refund progress">
                {steps.map((step, stepIndex) => (
                  <li key={step} className={stepIndex <= presentation.step ? 'is-reached' : ''} aria-current={stepIndex === presentation.step ? 'step' : undefined}>
                    <span className="appointment-refund-step" aria-hidden="true">
                      {stepIndex < presentation.step || presentation.step === 2 ? <CircleCheck size={15} /> : stepIndex + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="appointment-refund-message">{presentation.message}</p>
            {(requestedAt || completedAt) && <dl className="appointment-refund-dates">
              {requestedAt && <div><dt>Requested</dt><dd><time dateTime={refund.requestedAt}>{requestedAt}</time></dd></div>}
              {refund.status === 'REFUNDED' && completedAt && <div><dt>Processed</dt><dd><time dateTime={refund.completedAt}>{completedAt}</time></dd></div>}
            </dl>}
            {(refund.refundId || refund.paymentId) && (
              <dl className="appointment-refund-reference">
                <dt>{refund.refundId ? 'Refund reference' : 'Clinic payment reference'}</dt>
                <dd>{refund.refundId || refund.paymentId}</dd>
              </dl>
            )}
            {(presentation.tone === 'failed' || presentation.step < 0) && <Link className="appointment-refund-contact" to="/contact">Get help from the clinic <ArrowUpRight size={14} aria-hidden="true" /></Link>}
          </section>
        )
      })}
    </div>
  )
}
