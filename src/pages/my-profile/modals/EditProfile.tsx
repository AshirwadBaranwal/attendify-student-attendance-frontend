import { useUpdateCollegeAdminProfile } from "@/utils/api/CollegeAdminProfile";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCollegeAdmin } from "@/redux/features/user/userSlice";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditProfileModalProps {
  children: React.ReactNode;
}

const EditProfileModal = ({ children }: EditProfileModalProps) => {
  const collegeAdmin = useAppSelector(selectCollegeAdmin);

  // Local state for form fields
  const [name, setName] = useState(collegeAdmin?.name || "");
  const [phone, setPhone] = useState(collegeAdmin?.phone || "");
  const [isOpen, setIsOpen] = useState(false);

  // Initialize the mutation hook
  const { mutate, isPending } = useUpdateCollegeAdminProfile();

  // Reset local state when the dialog is opened/closed
  useEffect(() => {
    if (isOpen) {
      setName(collegeAdmin?.name || "");
      setPhone(collegeAdmin?.phone || "");
    }
  }, [isOpen, collegeAdmin]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = { name, phone };

    mutate(updatedData, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your personal information here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className="col-span-3"
                required
              />
            </div>
            {/* Phone Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                className="col-span-3"
                type="tel"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
