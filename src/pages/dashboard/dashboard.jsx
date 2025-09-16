import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/features/user/userSlice";
import { toast } from "sonner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      // 1. Dispatch the logout action and wait for it to complete
      dispatch(logout()).unwrap();

      // 2. After the logout is successful, navigate to the login page
      window.location.href = "/login";
    } catch (error) {
      // This will catch any errors if the logout API call fails
      console.error("Failed to log out:", error);
      // You could show an error toast here if needed
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>

      {user && (
        <div className="bg-card p-4 rounded-lg shadow">
          <p className="text-lg">Welcome, {user.email || "User"}!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
