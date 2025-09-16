import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import PublicRoute from "@/components/global/PublicRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Home from "@/pages/Home";
import Dashboard from "@/pages/dashboard/dashboard";
import { Provider } from "react-redux";
import store from "./redux/app/store";
import { Toaster } from "./components/ui/sonner";
import AppLayout from "./components/global/AppLayout";

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
            element: <Home />,
          },
          {
            path: "dashboard", // No leading slash
            element: <Dashboard />,
          },
          // Add other protected routes here
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
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>
);
