import React from "react";
import { WifiOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const OfflineModal = () => {
  const isOnline = useNetworkStatus();

  return (
    <AlertDialog open={!isOnline}>
      <AlertDialogContent className="max-w-[400px] border-destructive/20">
        <AlertDialogHeader className="flex flex-col items-center py-4">
          <div className="mb-4 p-3 bg-destructive/10 rounded-full">
            <WifiOff className="size-8 text-destructive animate-pulse" />
          </div>
          <AlertDialogTitle className="text-xl text-center">
            No Internet Connection
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You are currently offline. Please check your network settings. The
            app will automatically resume once you're back online.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OfflineModal;
