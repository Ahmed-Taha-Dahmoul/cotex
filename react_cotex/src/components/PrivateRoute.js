// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
