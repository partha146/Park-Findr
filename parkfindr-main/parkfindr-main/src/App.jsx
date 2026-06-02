import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ParkingProvider } from './context/ParkingContext'
import ProtectedRoute from './components/ProtectedRoute'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Search from './pages/Search'
import Slots from './pages/Slots'
import ParkingEntry from './pages/ParkingEntry'
import ActiveParking from './pages/ActiveParking'
import BillingSummary from './pages/BillingSummary'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import Help from './pages/Help'
import Active from './pages/Active'

export default function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/active"
            element={
              <ProtectedRoute>
                <Active />
              </ProtectedRoute>
            }
          />
          <Route path="/board" element={<Navigate to="/active" replace />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slots/:locationId"
            element={
              <ProtectedRoute>
                <Slots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parking-entry/:locationId/:slotId"
            element={
              <ProtectedRoute>
                <ParkingEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/active-parking"
            element={
              <ProtectedRoute>
                <ActiveParking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ParkingProvider>
    </AuthProvider>
  )
}
