import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
export function Button({ to, href, children, variant = 'primary', className = '', ...props }) {
  const classes = `g-button g-button-${variant} ${className}`
  if (to) return <Link to={to} className={classes} {...props}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>
  if (href) return <a href={href} className={classes} {...props}>{children}<ArrowUpRight size={17} aria-hidden="true" /></a>
  return <button className={classes} {...props}>{children}</button>
}
export function SectionHeading({ eyebrow, title, children }) {
  return <div className="g-section-heading"><span className="g-eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>
}
export function LoadingSkeleton() {
  return <div className="g-skeleton" role="status"><span>Loading our care team…</span></div>
}
