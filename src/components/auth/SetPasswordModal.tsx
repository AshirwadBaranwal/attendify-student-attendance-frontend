import { useState, useCallback, memo } from "react";
import { Button } from "../ui/button";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/utils/axios/axios";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types";
import PasswordStrengthIndicator, {
  usePasswordValid,
} from "./PasswordStrengthIndicator";

// Schema for password validation
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[@$!%*?&]/, "Password must include a special character (@$!%*?&)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetToken: string;
  onSuccess?: () => void;
}

function SetPasswordModal({
  isOpen,
  onClose,
  resetToken,
  onSuccess,
}: SetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const isPasswordValid = usePasswordValid(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = isPasswordValid && passwordsMatch;

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: PasswordFormData) => {
      try {
        setIsLoading(true);

        const response = await axiosClient.post(
          "/auth/college-admin/reset-forgot-password",
          {
            resetToken,
            newPassword: data.newPassword,
          }
        );

        toast.success(response.data.message || "Password reset successfully");
        reset();
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to reset password"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [resetToken, onSuccess, reset]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-60">
      <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">🔐 Set New Password</h2>
          <p className="mt-2 text-gray-600">
            Create a new secure password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Enter your new password"
                className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator password={newPassword} />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your new password"
                className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-2 text-sm text-red-500">
                Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && newPassword.length > 0 && (
              <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
                ✓ Passwords match
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-5 mt-4"
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default memo(SetPasswordModal);
