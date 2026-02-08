import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Doctors from './pages/Doctors'
import DoctorProfile from './pages/DoctorProfile'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Testimonials from './pages/Testimonials'
import Gallery from './pages/Gallery'
import Book from './pages/Book'
import Appointments from './pages/Appointments'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientDashboard from './pages/PatientDashboard'
import MyProfile from './pages/MyProfile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './admin/Login'
import AdminDashboard from './admin/Dashboard'
import DoctorsManager from './admin/DoctorsManager'
import ServicesManager from './admin/ServicesManager'
import AppointmentsManager from './admin/Appointments'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/:id" element={<DoctorProfile />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="book" element={<Book />} />
            <Route
              path="appointments"
              element={(
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <Appointments />
                </ProtectedRoute>
              )}
            />
            <Route path="doctor-dashboard" element={<DoctorDashboard />} />
            <Route
              path="patient-dashboard"
              element={(
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="my-profile"
              element={(
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <MyProfile />
                </ProtectedRoute>
              )}
            />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/doctors" element={<DoctorsManager />} />
            <Route path="admin/services" element={<ServicesManager />} />
            <Route path="admin/appointments" element={<AppointmentsManager />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
