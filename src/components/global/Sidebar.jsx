import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
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
];

// --- Sub-Components for Readability ---

const NavItem = ({ item, isActive }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        to={item.link}
        // UPDATED: Using sidebar-specific theme variables
        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors
          ${
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
              // UPDATED: Using sidebar-specific theme variables
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors
                ${
                  isSubMenuActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

      {/* Note: DropdownMenuContent usually uses global 'popover' colors.
         If you want it to match the sidebar specifically, you can add
         className="bg-sidebar border-sidebar-border text-sidebar-foreground"
      */}
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
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* UPDATED CONTAINER:
        - bg-sidebar: Sets the background color based on theme
        - text-sidebar-foreground: Sets the text color
        - border-sidebar-border: Sets the border color
      */}
      <aside className="h-screen w-20 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col items-center shrink-0 select-none">
        {/* Header - UPDATED border color */}
        <div className="flex items-center justify-center h-16 w-full border-b border-sidebar-border shrink-0">
          {/* Ensure your logo SVG handles 'currentColor' or looks good on the sidebar bg */}
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
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

        {/* Footer - UPDATED border color */}
        <div className="p-4 mt-auto border-t border-sidebar-border shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleLogout}
                // Optional: If you want the logout button to blend more until hovered:
                // className="bg-transparent text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground border border-sidebar-border"
              >
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
