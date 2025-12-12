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
import { useState } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DeleteAccountModal = ({ children }) => {
  const { user } = useSelector((state) => state.user);
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

export default DeleteAccountModal;
