import React, { useState } from "react";
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

const EditProfileModal = ({ children, user }) => {
  const [name, setName] = useState(user?.collegeAdmin?.name);
  const [phone, setPhone] = useState(user?.collegeAdmin?.phone);
  // Add mutation logic here to save changes
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your personal information here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{/* Form fields... */}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
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
