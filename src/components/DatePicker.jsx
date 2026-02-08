import { useEffect, useRef, useState } from 'react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(num) {
  return String(num).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default function DatePicker({ label, value, onChange, minDate }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
  const containerRef = useRef(null)

  const min = minDate ? startOfDay(new Date(minDate)) : null

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (value) {
      setViewDate(new Date(value))
    }
  }, [value])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < startWeekday; i += 1) days.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) days.push(new Date(year, month, d))

  function isDisabled(date) {
    if (!date) return true
    if (!min) return false
    return startOfDay(date) < min
  }

  function handleSelect(date) {
    if (isDisabled(date)) return
    onChange(formatDate(date))
    setOpen(false)
  }

  function goPrevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function goNextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  const displayValue = value ? value : 'Select date'

  return (
    <div className="date-picker" ref={containerRef}>
      {label && <span className="date-picker-label">{label}</span>}
      <button
        type="button"
        className="date-picker-input"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{displayValue}</span>
        <span className="date-picker-icon">📅</span>
      </button>

      {open && (
        <div className="date-picker-popover">
          <div className="date-picker-header">
            <button type="button" onClick={goPrevMonth} aria-label="Previous month">‹</button>
            <div className="date-picker-title">
              {viewDate.toLocaleString('default', { month: 'long' })} {year}
            </div>
            <button type="button" onClick={goNextMonth} aria-label="Next month">›</button>
          </div>
          <div className="date-picker-grid">
            {WEEKDAYS.map((d) => (
              <div key={d} className="date-picker-weekday">{d}</div>
            ))}
            {days.map((date, idx) => {
              const dayValue = date ? date.getDate() : ''
              const formatted = date ? formatDate(date) : ''
              const selected = value && formatted === value
              const disabled = isDisabled(date)
              return (
                <button
                  key={`${formatted}-${idx}`}
                  type="button"
                  className={`date-picker-day ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                  onClick={() => handleSelect(date)}
                  disabled={disabled}
                >
                  {dayValue}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
