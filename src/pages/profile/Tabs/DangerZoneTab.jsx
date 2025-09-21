import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AlertTriangle } from "lucide-react";

const DeleteAccountModal = ({ children, user }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmationMatching =
    confirmationText === user?.collegeAdmin?.collegeId?.name;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm, please type **
            {user?.collegeAdmin?.collegeId?.name}** below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder="Type the college name to confirm"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={!isConfirmationMatching}>
            I understand, delete everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DangerZoneTab = ({ user }) => {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} /> Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
          <h3 className="font-bold text-destructive">Delete This Account</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <DeleteAccountModal user={user}>
            <Button variant="destructive">
              Delete Account and All College Data
            </Button>
          </DeleteAccountModal>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneTab;
