import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// General Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Item Pages
import ReportLostItem from './pages/ReportLostItem';
import ReportFoundItem from './pages/ReportFoundItem';
import ReportPost from './pages/ReportPost';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import MyItems from './pages/MyItems';
import MyClaims from './pages/MyClaims';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

// Security Pages
import SecurityPendingClaims from './pages/security/SecurityPendingClaims';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('findora-theme') || 'light';
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${storedTheme}-mode`);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Auth Routes */}
            <Route path="/verify-email" element={<PrivateRoute><VerifyEmail /></PrivateRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

            {/* Item Routes */}
            <Route path="/report-lost" element={<PrivateRoute roles={['student', 'staff']}><ReportLostItem /></PrivateRoute>} />
            <Route path="/report-found" element={<PrivateRoute roles={['student', 'staff']}><ReportFoundItem /></PrivateRoute>} />
            <Route path="/report-post/:itemId" element={<PrivateRoute roles={['student', 'staff']}><ReportPost /></PrivateRoute>} />
            <Route path="/lost-items" element={<PrivateRoute roles={['student', 'staff']}><LostItems /></PrivateRoute>} />
            <Route path="/found-items" element={<PrivateRoute roles={['student', 'staff']}><FoundItems /></PrivateRoute>} />
            <Route path="/my-items" element={<PrivateRoute roles={['student', 'staff']}><MyItems /></PrivateRoute>} />
            <Route path="/my-claims" element={<PrivateRoute roles={['student', 'staff']}><MyClaims /></PrivateRoute>} />

            {/* Security Routes */}
            <Route path="/security/pending-claims" element={<PrivateRoute roles={['security', 'admin']}><SecurityPendingClaims /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
