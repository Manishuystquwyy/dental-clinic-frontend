import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleCheck, CircleAlert, X } from 'lucide-react'
import { NotificationContext } from '../context/NotificationContext'
import './Notifications.css'

function ConfirmationDialog({ request, onAnswer }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  return (
    <dialog ref={dialogRef} className="app-confirmation" aria-labelledby="confirmation-title" aria-describedby="confirmation-message"
      onCancel={(event) => { event.preventDefault(); onAnswer(false) }}>
      <div className="app-confirmation-icon"><CircleAlert size={26} aria-hidden="true" /></div>
      <h2 id="confirmation-title">{request.title}</h2>
      <p id="confirmation-message">{request.message}</p>
      <div className="app-confirmation-actions">
        <button type="button" className="secondary" autoFocus onClick={() => onAnswer(false)}>{request.cancelLabel}</button>
        <button type="button" className="app-confirmation-confirm" onClick={() => onAnswer(true)}>{request.confirmLabel}</button>
      </div>
    </dialog>
  )
}

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [confirmation, setConfirmation] = useState(null)
  const nextId = useRef(0)
  const resolver = useRef(null)
  const notify = useCallback((message, { title = 'Success', tone = 'success' } = {}) => {
    const id = ++nextId.current
    setNotifications((previous) => [...previous, { id, message, title, tone }])
  }, [])
  const dismiss = (id) => setNotifications((previous) => previous.filter((item) => item.id !== id))
  const confirmAction = useCallback((options) => {
    // Ignore duplicate requests while the existing decision is still pending.
    if (resolver.current) return Promise.resolve(false)
    return new Promise((resolve) => {
      resolver.current = resolve
      setConfirmation({ title: 'Are you sure?', cancelLabel: 'Keep appointment', confirmLabel: 'Cancel appointment', ...options })
    })
  }, [])
  const answer = useCallback((confirmed) => {
    const resolve = resolver.current
    resolver.current = null
    setConfirmation(null)
    resolve?.(confirmed)
  }, [])
  useEffect(() => () => { resolver.current?.(false); resolver.current = null }, [])
  const context = useMemo(() => ({ notify, confirmAction }), [notify, confirmAction])

  return (
    <NotificationContext.Provider value={context}>
      {children}
      <aside className="app-notifications" aria-label="Notifications">
        {['success', 'error'].map((tone) => (
          <div key={tone} role={tone === 'error' ? 'alert' : 'status'} aria-live={tone === 'error' ? 'assertive' : 'polite'} aria-relevant="additions">
            {notifications.filter((item) => item.tone === tone).map((item) => (
              <div key={item.id} className={`app-notification app-notification--${tone}`}>
                {tone === 'error' ? <CircleAlert className="app-notification-icon" size={23} aria-hidden="true" /> : <CircleCheck className="app-notification-icon" size={23} aria-hidden="true" />}
                <div><strong>{item.title}</strong><p>{item.message}</p></div>
                <button type="button" className="app-notification-close" aria-label={`Dismiss ${item.title.toLowerCase()} notification`} onClick={() => dismiss(item.id)}><X size={18} aria-hidden="true" /></button>
              </div>
            ))}
          </div>
        ))}
      </aside>
      {confirmation && <ConfirmationDialog request={confirmation} onAnswer={answer} />}
    </NotificationContext.Provider>
  )
}
