// src/components/RoleBasedRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    return <Navigate to="/dashboard" replace />; // fallback page
  }

  return children;
};

export default RoleBasedRoute;
