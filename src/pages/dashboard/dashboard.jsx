import Header from "@/components/global/Header";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="">
      <Header />
    </div>
  );
};

export default Dashboard;
