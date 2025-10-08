import React, { useEffect, useState } from "react";
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
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useUpdateCollegeAdminProfile } from "@/utils/api/CollegeAdminProfile";

const EditProfileModal = ({ children, user }) => {
  // Local state for form fields
  const [name, setName] = useState(user?.collegeAdmin?.name || "");
  const [phone, setPhone] = useState(user?.collegeAdmin?.phone || "");
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility

  // Initialize the mutation hook
  const { mutate, isPending } = useUpdateCollegeAdminProfile();

  // Reset local state when the dialog is opened/closed
  useEffect(() => {
    if (isOpen) {
      setName(user?.collegeAdmin?.name || "");
      setPhone(user?.collegeAdmin?.phone || "");
    }
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Data to be sent to the backend
    const updatedData = { name, phone };

    // Call the mutation function
    mutate(updatedData, {
      onSuccess: () => {
        // Close the modal upon successful update
        setIsOpen(false);
      },
      // onError is handled inside the hook, no need to duplicate here unless needed
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

        {/* Form for submission */}
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
                type="tel" // Use type tel for phone number input
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

const ProfileDetailsTab = ({ user }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User size={20} /> Personal Information
          </CardTitle>
          <CardDescription>Your personal details.</CardDescription>
        </div>
        <EditProfileModal user={user}>
          <Button variant="outline">Edit Profile</Button>
        </EditProfileModal>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Full Name</span>
          <span>{user?.collegeAdmin?.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Email Address</span>
          <span>{user?.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Phone Number</span>
          <span>{user?.collegeAdmin?.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Role</span>
          <span>College Administrator</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetailsTab;
