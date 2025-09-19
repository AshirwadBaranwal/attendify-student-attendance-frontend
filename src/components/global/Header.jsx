import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="h-16 border-b border-gray-200 shadow-sm p-3 flex justify-between items-center pl-5 pr-10">
      <div>
        <h2 className="text-xl font-bold">
          {user?.collegeAdmin?.collegeId?.name}
        </h2>
        <p className="text-sm text-gray-600">
          {user?.collegeAdmin?.collegeId?.address}
        </p>
      </div>
      <div className="flex  items-center relative ">
        <span className=" absolute -left-21 z-5 bg-green-100 text-green-800 text-xs p-1 rounded-l-full px-2">
          {user?.role}
        </span>
        <div className="z-10 mr-2 size-11 rounded-full border-4 border-green-100 overflow-hidden  flex items-center justify-center">
          <img
            src={user?.collegeAdmin?.profilePicture}
            className="size-10 "
            alt="profile"
          />
        </div>
        <div>
          <p className="text-sm font-medium ">{user?.collegeAdmin?.name}</p>
          <p className="text-xs text-gray-600">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
