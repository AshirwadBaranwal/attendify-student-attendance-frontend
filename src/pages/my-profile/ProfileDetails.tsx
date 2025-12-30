import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectCollegeAdmin } from "@/redux/features/user/userSlice";
import EditProfileModal from "./modals/EditProfile";

const ProfileDetails = () => {
  const user = useAppSelector(selectCurrentUser);
  const collegeAdmin = useAppSelector(selectCollegeAdmin);

  return (
    <Card className="rounded-none">
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
          <span className="font-medium text-muted-foreground">Full Name</span>
          <span>{collegeAdmin?.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-muted-foreground">
            Email Address
          </span>
          <span>{user?.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-muted-foreground">
            Phone Number
          </span>
          <span>{collegeAdmin?.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Role</span>
          <span>College Administrator</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
