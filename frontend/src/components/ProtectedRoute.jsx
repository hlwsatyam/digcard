import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;