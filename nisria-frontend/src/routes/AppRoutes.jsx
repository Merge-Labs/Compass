// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getDashboardRoute, ROLES } from '../constants/roles.js';

// Import your page components
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import {SuperAdminDashboard} from '../pages/dashboards/SuperAdminDashboard';
import {AdminDashboard} from '../pages/dashboards/AdminDashboard';
import {ManagementLeadDashboard} from '../pages/dashboards/ManagementLeadDashboard';
import {GrantOfficerDashboard} from '../pages/dashboards/GrantOfficerDashboard';

// Import ProtectedRoute
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to={getDashboardRoute(user?.role)} replace /> : 
            <Landing />
        } 
      />
      
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to={getDashboardRoute(user?.role)} replace /> : 
            <Login />
        } 
      />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard/super-admin" 
        element={
          <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/management-lead" 
        element={
          <ProtectedRoute requiredRole={ROLES.MANAGEMENT_LEAD}>
            <ManagementLeadDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/grant-officer" 
        element={
          <ProtectedRoute requiredRole={ROLES.GRANT_OFFICER}>
            <GrantOfficerDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all route - redirect to appropriate dashboard or login */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? 
            <Navigate to={getDashboardRoute(user?.role)} replace /> : 
            <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;