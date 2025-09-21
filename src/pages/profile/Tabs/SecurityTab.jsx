import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";

const ChangePasswordModal = ({ children }) => {
  // Add logic and state for changing password
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Please enter your current and new password below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{/* Form fields... */}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit">Update Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SecurityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={20} /> Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account's security settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Password</h3>
            <p className="text-sm text-gray-500">
              Change your password regularly to keep your account secure.
            </p>
          </div>
          <ChangePasswordModal>
            <Button>Change Password</Button>
          </ChangePasswordModal>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
