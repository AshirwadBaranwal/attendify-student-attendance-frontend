import Header from "@/components/global/Header";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  return (
    <div className="">
      <Header />
      <p>{user?.role}</p>
      <p>{user?.collegeAdmin?.name}</p>
      <p>{user?.collegeAdmin?.phone}</p>
      <p>{user?.collegeAdmin?._id}</p>
      <p>{user?.collegeAdmin?.profilePicture}</p>
    </div>
  );
};

export default Dashboard;
