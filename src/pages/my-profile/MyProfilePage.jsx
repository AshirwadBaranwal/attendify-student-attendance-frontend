import Header from "@/components/global/Header";
import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import SecuritySection from "./SecuritySection";
import DangerZone from "./DangerSection";
import LetterHeadSection from "./LetterHeadSection";
import RightSection from "./RightSection";

const MyProfilePage = () => {
  return (
    <div>
      <Header />
      <div className="h-[calc(100vh-66px)] flex ">
        <div className="w-4/6 h-[calc(100vh-66px)] overflow-auto">
          <ProfileHeader />
          <ProfileDetails />
          <LetterHeadSection />
          <SecuritySection />
          <DangerZone />
        </div>
        <div className="w-2/6 border-l">
          <RightSection />
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
