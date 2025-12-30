import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
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
import OptimizedImage from "./OptimisedImage";

// --- Types ---
interface MenuItem {
  title: string;
  icon: React.ReactNode;
  link: string;
  subOptions?: SubOption[];
}

interface SubOption {
  title: string;
  link: string;
}

interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
}

interface SubMenuProps {
  item: MenuItem & { subOptions: SubOption[] };
  activePath: string;
}

// --- Menu Configurations ---
const menuItems: MenuItem[] = [
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
    link: "/my-profile",
  },
];

// --- Sub-Components for Readability ---

const NavItem = ({ item, isActive }: NavItemProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        to={item.link}
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

const SubMenu = ({ item, activePath }: SubMenuProps) => {
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
  const dispatch = useAppDispatch();
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
      <aside className="h-screen w-20 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col items-center shrink-0 select-none">
        <div className="flex items-center justify-center h-16 w-full border-b border-sidebar-border shrink-0">
          <div className="w-8 h-8">
            <OptimizedImage
              src="/logo.png"
              alt="Attendify Logo"
              width={100}
              height={100}
              priority={true}
            />
          </div>
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
                item={item as MenuItem & { subOptions: SubOption[] }}
                activePath={location.pathname}
              />
            ) : (
              <NavItem key={item.title} item={item} isActive={isActive} />
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-sidebar-border shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleLogout}
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
