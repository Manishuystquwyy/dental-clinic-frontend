import { Outlet, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import './theme.css'
export default function App() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return <div className="site-root"><a className="g-skip" href="#main-content">Skip to content</a><Navbar /><main id="main-content" tabIndex={-1}><Suspense fallback={<p className="g-container" role="status">Loading page…</p>}><Outlet /></Suspense></main><Footer /></div>
}
