import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token"); 
  console.log(token);

  return token ? <Outlet /> : <Navigate to="/" replace />; // ✅ Redirect to "/" if not authenticated
};

export default ProtectedRoute;
