import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const ProtectedRoute = ({ children, roles }) => {
  const { getUser } = useAuth();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // eslint-disable-next-line react/prop-types
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />; // TODO не авторизован
  }

  return children;

};

export default ProtectedRoute;