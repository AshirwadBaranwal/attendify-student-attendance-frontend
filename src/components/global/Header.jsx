import React from "react";
import { useSelector } from "react-redux";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const Header = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="sticky top-0 z-50 h-16 border-b border-border shadow-sm p-3 flex justify-between items-center pl-5 pr-10 bg-sidebar   ">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {user?.collegeAdmin?.collegeId?.name}
        </h2>

        <p className="text-sm text-muted-foreground">
          {user?.collegeAdmin?.collegeId?.address}
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center relative">
          <div className="z-10 mr-2 size-11 rounded-full border-4 border-card bg-card overflow-hidden flex items-center justify-center shadow-sm ring-1 ring-primary/20">
            <img
              src={user?.collegeAdmin?.profilePicture}
              className="size-10 object-cover"
              alt="profile"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              {user?.collegeAdmin?.name}
            </p>

            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <AnimatedThemeToggler />
      </div>
    </div>
  );
};

export default Header;
