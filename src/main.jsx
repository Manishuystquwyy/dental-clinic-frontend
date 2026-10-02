import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const Legal = lazy(() => import('./pages/Legal'))
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Doctors = lazy(() => import('./pages/Doctors'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Book = lazy(() => import('./pages/Book'))
const Appointments = lazy(() => import('./pages/Appointments'))
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'))
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'))
const MyProfile = lazy(() => import('./pages/MyProfile'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Checkout = lazy(() => import('./pages/Checkout'))
const AdminLogin = lazy(() => import('./admin/Login'))
const AdminDashboard = lazy(() => import('./admin/Dashboard'))
const DoctorsManager = lazy(() => import('./admin/DoctorsManager'))
const ServicesManager = lazy(() => import('./admin/ServicesManager'))
const AppointmentsManager = lazy(() => import('./admin/Appointments'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="privacy" element={<Legal />} />
            <Route path="terms" element={<Legal />} />
            <Route path="about" element={<About />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/:id" element={<DoctorProfile />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="testimonials" element={<Testimonials />} />
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
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="signup" element={<Signup />} />
            <Route
              path="checkout"
              element={(
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <Checkout />
                </ProtectedRoute>
              )}
            />
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
