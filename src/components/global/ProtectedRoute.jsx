import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AddCollegePage from "@/pages/AddCollegePage";

const ProtectedRoute = () => {
  // loading state is already handled by AppLayout, we just need the user status
  const { user } = useSelector((state) => state.user);

  // If there's no user, redirect to the login page.
  // The `replace` prop avoids adding a new entry to the history stack.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.collegeAdmin?.collegeId) {
    return <AddCollegePage />;
  }

  // If the user is authenticated, render the nested routes.
  return <Outlet />;
};

export default ProtectedRoute;
