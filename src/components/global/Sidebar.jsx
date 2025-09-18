import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  CreditCard,
  Settings,
  ChevronDown,
  LayoutDashboard,
  School,
  ShieldUser,
  CircleUserRound,
  LogOut,
  UserCog,
} from "lucide-react";

import { logout } from "@/redux/features/user/userSlice";
import { Button } from "../ui/button";

// --- Menu Configurations ---

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
    title: "Faculty",
    icon: <ShieldUser size={20} />,
    link: "/faculty",
  },
  {
    title: "Students",
    icon: <Users size={20} />,
    link: "/students",
  },
  {
    title: "Attendance",
    icon: <CreditCard size={20} />,
    link: "/attendance",
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    subOptions: [
      { title: "Account", link: "/settings/account" },
      { title: "Security", link: "/settings/security" },
      { title: "Appearance", link: "/settings/appearance" },
    ],
  },
];

// --- Sub-Components for Readability ---

const NavItem = ({ item, isActive }) => (
  <Link
    to={item.link}
    className={`flex items-center gap-4 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
      ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
  >
    {item.icon}
    <span>{item.title}</span>
  </Link>
);

const SubMenu = ({ item, activePath }) => {
  const [isOpen, setIsOpen] = useState(
    item.subOptions.some((sub) => activePath.startsWith(sub.link))
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-4">
          {item.icon}
          <span>{item.title}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 pl-8 space-y-1">
            {item.subOptions.map((subItem) => {
              const isActive = activePath.startsWith(subItem.link);
              return (
                <Link
                  key={subItem.title}
                  to={subItem.link}
                  className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {subItem.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Sidebar Component ---

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      dispatch(logout()).unwrap();
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <aside className="h-screen w-64 bg-[#192030] text-white flex flex-col shrink-0 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-700 shrink-0">
        <img src="/logo.png" alt="logo" className="w-8 h-8" />
        <span className="text-xl font-bold tracking-wider">Attendify</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            !item.subOptions && location.pathname.startsWith(item.link);
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
      <div className="p-4 border-t border-gray-700 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <CircleUserRound size={40} className="text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-white">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "Role"}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
