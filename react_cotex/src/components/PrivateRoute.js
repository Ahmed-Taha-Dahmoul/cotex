// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
