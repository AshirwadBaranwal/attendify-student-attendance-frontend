import React from "react";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import Header from "@/components/global/Header";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileTabs from "./ProfileTabs";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.user);

  // A placeholder banner image, which could also come from user data
  const bannerImage =
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop";

  return (
    <div>
      <Header />
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto">
          <Card className="overflow-hidden pt-0">
            <ProfileHeader user={user} bannerImage={bannerImage} />
            <ProfileInfo
              name={user?.collegeAdmin?.name}
              email={user?.email}
              collegeName={user?.collegeAdmin?.collegeId?.name}
            />
            <ProfileTabs user={user} />
          </Card>
        </div>
      </div>
    </div>
  );
}
