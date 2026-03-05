import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/user/Home';
import Booking from './pages/user/Booking';
import Ticket from './pages/user/Ticket';
import BookingHistory from './pages/user/BookingHistory';
import Dashboard from './pages/admin/Dashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageTheatres from './pages/admin/ManageTheatres';
import AdminBookings from './pages/admin/AdminBookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route path="/home" element={<Home />} />
          <Route path="/book/:movieId" element={<Booking />} />
          <Route path="/ticket/:bookingId" element={<Ticket />} />
          <Route path="/my-bookings" element={<BookingHistory />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="theatres" element={<ManageTheatres />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
