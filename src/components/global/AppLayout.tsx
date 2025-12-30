// src/components/global/AppLayout.tsx
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUser, selectIsLoading } from "@/redux/features/user/userSlice";
import { Toaster } from "@/components/ui/sonner";
import Loading from "./Loading";
import OfflineModal from "./OfflineModal";

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <OfflineModal />
      <Toaster />
    </>
  );
};

export default AppLayout;
