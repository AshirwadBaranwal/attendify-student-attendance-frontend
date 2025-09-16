// ForgotPasswordModal.jsx
import React, { useState, useCallback, memo } from "react";
import { Button } from "../ui/button";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import OTPModal from "./OTPModal";
import SetPasswordModal from "./SetPasswordModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for email validation
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle email submission
  const onSubmit = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setEmail(data.email);

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/college-admin/send-forgot-password-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      // Check if response has content before parsing JSON
      const text = await response.text();
      const result = text.length ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset email");
      }

      toast.success("Reset code sent to your email");
      setShowOTPModal(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle OTP verification
  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/college-admin/verify-forgot-password-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      // Check if response has content before parsing JSON
      const text = await response.text();
      const result = text.length ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(result.message || "Failed to verify OTP");
      }

      toast.success("OTP verified successfully");
      setShowOTPModal(false);
      setShowSetPasswordModal(true);
    } catch (error) {
      toast.error(error.message || "Invalid or expired OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [email, otp]);

  // Handle resend OTP
  const handleResendOtp = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/college-admin/resend-forgot-password-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Check if response has content before parsing JSON
      const text = await response.text();
      const result = text.length ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(result.message || "Failed to resend OTP");
      }

      toast.success("New OTP sent to your email");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Handle password reset success
  const handlePasswordResetSuccess = useCallback(() => {
    setShowSetPasswordModal(false);
    reset();
    onClose();
    toast.success(
      "Password reset successfully! You can now login with your new password."
    );
  }, [onClose, reset]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-60">
        <div className="relative w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold">🔑 Forgot Password</h2>
          <p className="mb-6 mt-2 text-gray-600">
            Enter your email address and we'll send you a code to reset your
            password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            {errors.email && (
              <p className="text-left text-sm text-red-500">
                {errors.email.message}
              </p>
            )}

            <Button type="submit" className="w-full py-5" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="text-sm text-primary hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        useCase="forgotPassword"
        onOtpChange={setOtp}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isVerifying={isVerifyingOtp}
        email={email}
      />

      {/* Set New Password Modal */}
      {showSetPasswordModal && (
        <SetPasswordModal
          isOpen={showSetPasswordModal}
          onClose={() => setShowSetPasswordModal(false)}
          email={email}
          onSuccess={handlePasswordResetSuccess}
        />
      )}
    </>
  );
};

export default memo(ForgotPasswordModal);
