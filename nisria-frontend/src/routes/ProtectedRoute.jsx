// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { ROLES, getDashboardRoute } from '../constants/roles';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredRoles = null,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    const userDashboard = getDashboardRoute(user?.role);
    return <Navigate to={userDashboard} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    const userDashboard = getDashboardRoute(user?.role);
    return <Navigate to={userDashboard} replace />;
  }

  return children;
};

// Higher-order component for role-specific protection
export const withRoleProtection = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Higher-order component for multiple roles protection
export const withRolesProtection = (Component, requiredRoles) => {
  return (props) => (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;