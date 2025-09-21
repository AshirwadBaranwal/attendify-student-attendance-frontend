import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ProfileDetailsTab from "./tabs/ProfileDetailsTab";
// import CollegeDetailsTab from "./tabs/CollegeDetailsTab";
import SecurityTab from "./tabs/SecurityTab";
import DangerZoneTab from "./tabs/DangerZoneTab";
import ProfileDetailsTab from "./Tabs/ProfileDetailsTab";
import CollegeDetailsTab from "./Tabs/CollegeDetailsTab";

const ProfileTabs = ({ user }) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
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
        <ProfileDetailsTab user={user} />
      </TabsContent>
      <TabsContent value="college" className="p-6">
        <CollegeDetailsTab college={user?.collegeAdmin?.collegeId} />
      </TabsContent>
      <TabsContent value="security" className="p-6">
        <SecurityTab />
      </TabsContent>
      <TabsContent value="danger" className="p-6">
        <DangerZoneTab user={user} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
