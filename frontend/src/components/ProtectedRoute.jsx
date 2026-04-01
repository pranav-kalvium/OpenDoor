import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Spinner } from '@chakra-ui/react';

/**
 * Wraps routes that require authentication and/or specific roles.
 * 
 * Usage:
 *   <ProtectedRoute>                          — auth required, any role
 *   <ProtectedRoute allowedRoles={['admin']}> — auth required, admin only
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
