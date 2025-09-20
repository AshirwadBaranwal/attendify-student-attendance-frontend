import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertTriangle,
  ShieldCheck,
  User,
  Building,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import Header from "@/components/global/Header";

// --- Static Data (as described in the proposal) ---
const collegeAdminData = {
  name: "Dr. Alok Sharma",
  email: "alok.sharma@nitp.ac.in",
  phone: "+91 98765 43210",
  role: "College Administrator",
  avatarInitials: "AS",
  avatarImage: "https://placehold.co/128x128/E0E7FF/4F46E5?text=AS", // Placeholder for a real image
};

const collegeData = {
  name: "National Institute of Technology, Patna",
  id: "60d5ecf1a9b8d834b4e9f1c2",
  address: "Ashok Rajpath, Patna, Bihar 800005",
  contactEmail: "contact@nitp.ac.in",
  bannerImage:
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop", // A generic university image
};

// --- Sub-components (within the same file for simplicity) ---

const ProfileHeader = ({ user }) => (
  <div className="relative">
    <div
      className="w-full h-80 md:h-80 bg-cover bg-center rounded-t-lg"
      style={{ backgroundImage: `url(${collegeData.bannerImage})` }}
    >
      {/* Banner Image */}
    </div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
      <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background shadow-lg">
        <AvatarImage
          src={user?.collegeAdmin?.profilePicture}
          alt={user?.collegeAdmin?.name}
        />
        <AvatarFallback className="text-4xl">
          {collegeAdminData.avatarInitials} // Todo: Make fallback
        </AvatarFallback>
      </Avatar>
    </div>
  </div>
);

const EditProfileModal = ({ children }) => {
  // In a real app, you'd use react-hook-form here
  const [name, setName] = useState(collegeAdminData.name);
  const [phone, setPhone] = useState(collegeAdminData.phone);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your personal information here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right">
              Phone
            </label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
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

const ChangePasswordModal = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Please enter your current and new password below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm">Current</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm">New</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm">Confirm</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Update Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAccountModal = ({ children }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmationMatching = confirmationText === collegeData.name;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm permanent deletion of your
            account and all data for **{collegeData.name}**, please type the
            college's name below.
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
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={!isConfirmationMatching}>
            I understand, delete everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Page Component ---
export default function ProfilePage() {
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      <Header />
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto">
          <Card className="overflow-hidden pt-0 ">
            <ProfileHeader user={user} />

            <div className="text-center pt-20 pb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.collegeAdmin?.name}
              </h1>
              <p className="text-md text-gray-500 mt-1">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {user?.collegeAdmin?.collegeId?.name}
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full ">
              <TabsList className="bg-transparent border-b rounded-none px-6">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none mr-5"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="college"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none mr-5"
                >
                  College Details
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none mr-5"
                >
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="danger"
                  className="text-destructive data-[state=active]:text-destructive data-[state=active]:border-b-red-800 border-2 data-[state=active]:shadow-none rounded-none mr-5"
                >
                  Danger Zone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User size={20} /> Personal Information
                      </CardTitle>
                      <CardDescription>Your personal details.</CardDescription>
                    </div>
                    <EditProfileModal>
                      <Button variant="outline">Edit Profile</Button>
                    </EditProfileModal>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Full Name
                      </span>
                      <span>{user?.collegeAdmin?.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Email Address
                      </span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Phone Number
                      </span>
                      <span>{user?.collegeAdmin?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Role</span>
                      <span>College Administrator</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="college" className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building size={20} /> College Information
                    </CardTitle>
                    <CardDescription>
                      Read-only details about your assigned college.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        College Name
                      </span>
                      <span>{user?.collegeAdmin?.collegeId?.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        College ID
                      </span>
                      <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                        {user?.collegeAdmin?.collegeId?._id}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Address</span>
                      <span> {user?.collegeAdmin?.collegeId?.address}</span>
                    </div>
                    {/* <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Contact Email
                    </span>
                    <span>{collegeData.contactEmail}</span>
                  </div> */}
                    <p className="text-xs text-gray-500 italic pt-4">
                      College details are managed by the platform administrator.
                      Please contact support to request changes.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="p-6">
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
                          Change your password regularly to keep your account
                          secure.
                        </p>
                      </div>
                      <ChangePasswordModal>
                        <Button>Change Password</Button>
                      </ChangePasswordModal>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="danger" className="p-6">
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle size={20} /> Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                      <h3 className="font-bold text-destructive">
                        Delete This Account
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 mb-4">
                        Once you delete your account, there is no going back.
                        This will permanently delete your College Admin profile,
                        your user account, and **all associated college data**,
                        including all departments and department admins. Please
                        be absolutely certain before proceeding.
                      </p>
                      <DeleteAccountModal>
                        <Button variant="destructive">
                          Delete Account and All College Data
                        </Button>
                      </DeleteAccountModal>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
