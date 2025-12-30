// src/components/global/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectIsLoading,
  selectCollege,
} from "@/redux/features/user/userSlice";
import AddCollegePage from "@/pages/AddCollegePage";

const ProtectedRoute = () => {
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectIsLoading);
  const college = useAppSelector(selectCollege);

  // If there's no user, redirect to the login page.
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but has no college set up yet
  if (!loading && user && !college?._id) {
    return <AddCollegePage />;
  }

  // If the user is authenticated, render the nested routes.
  return <Outlet />;
};

export default ProtectedRoute;
