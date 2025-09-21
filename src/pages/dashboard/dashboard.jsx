import Header from "@/components/global/Header";
import React from "react";
import { useSelector } from "react-redux";
import WelcomeCard from "./WelcomeCard";
import Schedule from "./Schedule";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="">
      <Header />
      <div className="flex   h-[calc(100vh-65px)] ">
        <div className="flex flex-col gap-3 w-full bg-[#f5f5f6] p-5">
          <WelcomeCard />
        </div>
        <div className="  max-h-[calc(100vh-65px)] overflow-auto w-3/7">
          <Schedule />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
