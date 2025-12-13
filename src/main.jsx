import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react"; // 1. Import lazy and Suspense

// Keep non-page components as static imports (usually fine)
import ProtectedRoute from "@/components/global/ProtectedRoute";
import PublicRoute from "@/components/global/PublicRoute";
import AppLayout from "./components/global/AppLayout";
import store from "./redux/app/store";
import { Toaster } from "./components/ui/sonner";
import Loading from "./components/global/Loading";

// 2. Convert Page imports to Lazy Imports
// This tells Vite: "Don't bundle these yet. Create separate files."
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const Dashboard = lazy(() => import("@/pages/dashboard/dashboard"));
const SidebarLayout = lazy(() => import("./pages/dashboard/sidebarLayout"));
const DepartmentPage = lazy(() => import("./pages/department/departmentPage"));
const AdminPage = lazy(() => import("./pages/Admins/AdminPage"));
const MyProfilePage = lazy(() => import("./pages/my-profile/MyProfilePage"));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // --- Protected Routes ---
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            // Wrap the Layout in Suspense too if it's large
            element: (
              <Suspense fallback={<Loading />}>
                <SidebarLayout />
              </Suspense>
            ),
            children: [
              {
                path: "/",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Dashboard />
                  </Suspense>
                ),
              },
              {
                path: "/departments",
                element: (
                  <Suspense fallback={<Loading />}>
                    <DepartmentPage />
                  </Suspense>
                ),
              },
              {
                path: "/admins",
                element: (
                  <Suspense fallback={<Loading />}>
                    <AdminPage />
                  </Suspense>
                ),
              },
              {
                path: "/my-profile",
                element: (
                  <Suspense fallback={<Loading />}>
                    <MyProfilePage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // --- Public Routes ---
      {
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<Loading />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: "register",
            element: (
              <Suspense fallback={<Loading />}>
                <RegisterPage />
              </Suspense>
            ),
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
