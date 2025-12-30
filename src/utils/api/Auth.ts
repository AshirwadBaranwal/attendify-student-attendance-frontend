import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios";
import type { ApiResponse, ApiError } from "@/types";
import type { AxiosError } from "axios";

// --- Types ---

interface SendForgotPasswordOtpInput {
  email: string;
}

interface VerifyForgotPasswordOtpInput {
  email: string;
  otp: string;
}

interface VerifyForgotPasswordOtpResponse {
  resetToken: string;
}

interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

interface CreateCollegeInput {
  name: string;
  university: string;
  collegeReg: string;
  address: string;
}

// --- Mutation Hooks ---

/**
 * Hook for sending forgot password OTP.
 */
export function useSendForgotPasswordOtp() {
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, SendForgotPasswordOtpInput>({
    mutationFn: async (data) => {
      const response = await axiosClient.post<ApiResponse<null>>(
        "/auth/college-admin/send-forgot-password-otp",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Reset code sent to your email");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
    },
  });
}

/**
 * Hook for verifying forgot password OTP.
 */
export function useVerifyForgotPasswordOtp() {
  return useMutation<
    ApiResponse<VerifyForgotPasswordOtpResponse>,
    AxiosError<ApiError>,
    VerifyForgotPasswordOtpInput
  >({
    mutationFn: async (data) => {
      const response = await axiosClient.post<ApiResponse<VerifyForgotPasswordOtpResponse>>(
        "/auth/college-admin/verify-forgot-password-otp",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "OTP verified successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
    },
  });
}

/**
 * Hook for resending forgot password OTP.
 */
export function useResendForgotPasswordOtp() {
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, { email: string }>({
    mutationFn: async (data) => {
      const response = await axiosClient.post<ApiResponse<null>>(
        "/auth/college-admin/resend-forgot-password-otp",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "New OTP sent to your email");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP"
      );
    },
  });
}

/**
 * Hook for resetting password after OTP verification.
 */
export function useResetForgotPassword() {
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, ResetPasswordInput>({
    mutationFn: async (data) => {
      const response = await axiosClient.post<ApiResponse<null>>(
        "/auth/college-admin/reset-forgot-password",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
    },
  });
}

/**
 * Hook for creating a new college.
 */
export function useCreateCollege() {
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, CreateCollegeInput>({
    mutationFn: async (data) => {
      const response = await axiosClient.post<ApiResponse<null>>(
        "/college",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("College created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create college"
      );
    },
  });
}
