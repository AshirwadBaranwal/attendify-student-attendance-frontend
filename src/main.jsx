import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import PublicRoute from "@/components/global/PublicRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Dashboard from "@/pages/dashboard/dashboard";
import { Provider } from "react-redux";
import store from "./redux/app/store";
import { Toaster } from "./components/ui/sonner";
import AppLayout from "./components/global/AppLayout";
import SidebarLayout from "./pages/dashboard/sidebarLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DepartmentPage from "./pages/department/departmentPage";
import AdminPage from "./pages/Admins/AdminPage";
// import ProfilePage from "./pages/profile/ProfilePage";
import MyProfilePage from "./pages/my-profile/MyProfilePage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    // The AppLayout component will now handle the initial auth check and loading state
    path: "/",
    element: <AppLayout />,
    children: [
      // --- Protected Routes ---
      // These routes are children of ProtectedRoute
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/", // Matches the root path
            element: <SidebarLayout />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "/departments",
                element: <DepartmentPage />,
              },
              {
                path: "/admins",
                element: <AdminPage />,
              },
              // {
              //   path: "/profile",
              //   element: <ProfilePage />,
              // },
              {
                path: "/my-profile",
                element: <MyProfilePage />,
              },
            ],
          },
        ],
      },
      // --- Public Routes ---
      // These routes are children of PublicRoute
      {
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </QueryClientProvider>
);
