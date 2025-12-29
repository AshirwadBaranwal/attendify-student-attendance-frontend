import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios";
import { fetchUser } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import type { CollegeAdminPopulated, ApiResponse, ApiError } from "@/types";
import type { AxiosError } from "axios";

const BASE_URL = "/college-admin";

// --- Query Keys ---
export const collegeAdminKeys = {
  all: ["collegeAdmin"] as const,
  profile: () => [...collegeAdminKeys.all, "profile"] as const,
};

// --- Mutation Hooks ---

/**
 * Hook for updating profile picture.
 */
export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<{ profilePicture: string }, AxiosError<ApiError>, File>({
    mutationFn: async (imageFile) => {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);

      const response = await axiosClient.patch<ApiResponse<{ profilePicture: string }>>(
        `${BASE_URL}/profile-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log("Profile picture updated successfully! Response:", data);
      toast.success("Profile picture updated successfully!");
      queryClient.invalidateQueries({ queryKey: collegeAdminKeys.profile() });
      // Dispatch the fetchUser action to update your Redux store
      dispatch(fetchUser());
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture"
      );
    },
  });
}

interface UpdateProfileData {
  name: string;
  phone: string;
}

/**
 * Hook for updating college admin profile.
 */
export function useUpdateCollegeAdminProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<CollegeAdminPopulated, AxiosError<ApiError>, UpdateProfileData>({
    mutationFn: async (profileData) => {
      const response = await axiosClient.patch<ApiResponse<CollegeAdminPopulated>>(
        `${BASE_URL}/profile`,
        profileData
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully! Response:", data);
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: collegeAdminKeys.profile() });
      dispatch(fetchUser());
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile details"
      );
    },
  });
}
