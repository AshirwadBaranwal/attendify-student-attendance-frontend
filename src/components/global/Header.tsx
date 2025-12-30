import { useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectCollege,
  selectCollegeAdmin,
} from "@/redux/features/user/userSlice";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
  const user = useAppSelector(selectCurrentUser);
  const college = useAppSelector(selectCollege);
  const collegeAdmin = useAppSelector(selectCollegeAdmin);

  return (
    <div className="sticky top-0 z-50 h-16 border-b border-border shadow-sm p-3 flex justify-between items-center pl-5 pr-10 bg-sidebar   ">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {college?.name}
        </h2>

        <p className="text-sm text-muted-foreground">
          {college?.address}
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center relative gap-4">
          <Avatar className="size-10 border-2">
            <AvatarImage src={collegeAdmin?.profilePicture} />
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium text-foreground">
              {collegeAdmin?.name}
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
