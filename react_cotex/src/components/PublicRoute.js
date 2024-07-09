// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PublicRoute = ({ element, ...rest }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? <Navigate to="/" /> : element;
};

export default PublicRoute;
