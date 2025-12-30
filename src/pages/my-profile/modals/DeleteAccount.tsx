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
import { useState, type ChangeEvent } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCollege } from "@/redux/features/user/userSlice";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeleteAccountModalProps {
  children: React.ReactNode;
}

const DeleteAccountModal = ({ children }: DeleteAccountModalProps) => {
  const college = useAppSelector(selectCollege);
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmationMatching = confirmationText === college?.name;

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
            {college?.name}** below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder="Type the college name to confirm"
            value={confirmationText}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmationText(e.target.value)
            }
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
