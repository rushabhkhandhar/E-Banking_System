import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Public pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';

// Protected pages
import Dashboard from '../pages/Dashboard';
import Accounts from '../pages/Accounts';
import Transactions from '../pages/Transactions';
import Transfer from '../pages/Transfer';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

// Admin pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import AccountManagement from '../pages/admin/AccountManagement';

function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Auth Routes - redirect if already logged in */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/accounts" element={
        <ProtectedRoute>
          <Accounts />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="/transfer" element={
        <ProtectedRoute>
          <Transfer />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/accounts" element={
        <ProtectedRoute adminOnly>
          <AccountManagement />
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
