// src/components/global/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/user/userSlice";

const PublicRoute = () => {
  const user = useAppSelector(selectCurrentUser);

  // If a user exists, they are logged in. Redirect them away from public pages.
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If no user, render the public route (e.g., Login, Register).
  return <Outlet />;
};

export default PublicRoute;
