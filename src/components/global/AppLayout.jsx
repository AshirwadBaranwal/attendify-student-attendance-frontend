// src/components/global/AppLayout.js
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/redux/features/user/userSlice";
import { Toaster } from "@/components/ui/sonner"; // Keep Toaster here
import Loading from "./Loading";
import OfflineModal from "./OfflineModal";

const AppLayout = () => {
  const dispatch = useDispatch();
  // We only need the user's initial loading state to know if the check is done.
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    // Dispatch fetchUser only once when the app component mounts
    dispatch(fetchUser());
  }, [dispatch]);

  // While the initial user fetch is happening, you can show a global loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Once loading is false, render the routes
  return (
    <>
      <Outlet />
      <OfflineModal />
      <Toaster />
    </>
  );
};

export default AppLayout;
