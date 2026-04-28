import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';
import { UserRole } from '../types';

interface RouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<RouteProps> = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

export const OrganizerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
      {children}
    </ProtectedRoute>
  );
};

export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = authService.getCurrentUser();
  const location = useLocation();

  // Only redirect if we are on a guest-only page (login, etc)
  const guestOnlyPaths = ['/login', '/register', '/forgot-password'];
  
  if (user && guestOnlyPaths.includes(location.pathname)) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/organizer-dashboard" replace />;
  }

  return <>{children}</>;
};
