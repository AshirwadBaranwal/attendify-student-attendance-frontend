// src/components/global/PublicRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { user } = useSelector((state) => state.user);

  // If a user exists, they are logged in. Redirect them away from public pages.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If no user, render the public route (e.g., Login, Register).
  return <Outlet />;
};

export default PublicRoute;
