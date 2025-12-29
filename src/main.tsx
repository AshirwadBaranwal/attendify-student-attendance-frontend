import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

// Keep non-page components as static imports (usually fine)
import ProtectedRoute from "@/components/global/ProtectedRoute.jsx";
import PublicRoute from "@/components/global/PublicRoute.jsx";
import AppLayout from "./components/global/AppLayout.jsx";
import store from "./redux/app/store";
import { Toaster } from "./components/ui/sonner";
import Loading from "./components/global/Loading.jsx";

// Lazy Imports for Pages (code splitting)
const LoginPage = lazy(() => import("@/pages/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage.jsx"));
const Dashboard = lazy(() => import("@/pages/dashboard/dashboard.jsx"));
const SidebarLayout = lazy(() => import("./pages/dashboard/sidebarLayout.jsx"));
const DepartmentPage = lazy(() => import("./pages/department/departmentPage.jsx"));
const AdminPage = lazy(() => import("./pages/Admins/AdminPage.jsx"));
const MyProfilePage = lazy(() => import("./pages/my-profile/MyProfilePage.jsx"));

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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </QueryClientProvider>
);
