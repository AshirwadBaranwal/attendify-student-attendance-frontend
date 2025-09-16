import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Home from "@/pages/Home";
import { Provider } from "react-redux";
import store from "./redux/app/store";
import { Toaster } from "./components/ui/sonner";
import OTPVerification from "./components/auth/VerifyRegisterEmail";
import OTPModalDemo from "./components/auth/OTPverificationModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/otp-verify",
        element: <OTPVerification />,
      },
      {
        path: "/otp-modal",
        element: <OTPModalDemo />,
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
