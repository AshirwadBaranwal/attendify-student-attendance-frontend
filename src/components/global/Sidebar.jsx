import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  CreditCard,
  Settings,
  LayoutDashboard,
  School,
  ShieldUser,
  LogOut,
  UserCog,
} from "lucide-react";

import { logout } from "@/redux/features/user/userSlice";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Menu Configurations ---
// No changes needed here, the structure is fine.
const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    link: "/",
  },
  {
    title: "Departments",
    icon: <School size={20} />,
    link: "/departments",
  },
  {
    title: "Admins",
    icon: <UserCog size={20} />,
    link: "/admins",
  },
  {
    title: "Profile",
    icon: <ShieldUser size={20} />,
    link: "/profile",
  },
  // {
  //   title: "Settings",
  //   icon: <Settings size={20} />,
  //   subOptions: [
  //     { title: "Account", link: "/settings/account" },
  //     { title: "Security", link: "/settings/security" },
  //     { title: "Appearance", link: "/settings/appearance" },
  //   ],
  // },
];

// --- Sub-Components for Readability ---

const NavItem = ({ item, isActive }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        to={item.link}
        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors
          ${
            isActive
              ? "bg-primary text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
      >
        {item.icon}
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>{item.title}</p>
    </TooltipContent>
  </Tooltip>
);

const SubMenu = ({ item, activePath }) => {
  const isSubMenuActive = item.subOptions.some((sub) =>
    activePath.startsWith(sub.link)
  );

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors
                ${
                  isSubMenuActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
            >
              {item.icon}
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" className="ml-2">
        {item.subOptions.map((subItem) => (
          <Link to={subItem.link} key={subItem.title}>
            <DropdownMenuItem className="cursor-pointer">
              {subItem.title}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Main Sidebar Component ---

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      // Use navigate for client-side routing instead of a full page reload
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    // Use TooltipProvider at the root of the component
    <TooltipProvider delayDuration={0}>
      <aside className="h-screen w-20 bg-[#192030] text-white flex flex-col items-center shrink-0 select-none">
        {/* Header */}
        <div className="flex items-center justify-center h-16 w-full border-b border-gray-700 shrink-0">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            // Updated isActive logic for exact match on dashboard
            const isActive =
              item.link === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.link);

            return item.subOptions ? (
              <SubMenu
                key={item.title}
                item={item}
                activePath={location.pathname}
              />
            ) : (
              <NavItem key={item.title} item={item} isActive={isActive} />
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-gray-700 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" onClick={handleLogout}>
                <LogOut size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
