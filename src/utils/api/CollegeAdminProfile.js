import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios";
import { fetchUser } from "@/redux/features/user/userSlice";
import { useDispatch } from "react-redux"; // 1. Import useDispatch

const BASE_URL = "/college-admin";

export const collegeAdminKeys = {
  all: ["collegeAdmin"],
  profile: () => [...collegeAdminKeys.all, "profile"],
};

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch(); // 2. Get the dispatch function

  return useMutation({
    mutationFn: async (imageFile) => {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);

      const response = await axiosClient.patch(
        `${BASE_URL}/profile-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Profile picture updated successfully! Response:", data);
      toast.success("Profile picture updated successfully!");
      queryClient.invalidateQueries({ queryKey: collegeAdminKeys.profile() });

      // 3. Dispatch the fetchUser action to update your Redux store
      dispatch(fetchUser());
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture"
      );
    },
  });
}

export function useUpdateCollegeAdminProfile() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (profileData) => {
      // profileData will be { name: string, phone: string }
      const response = await axiosClient.patch(
        `${BASE_URL}/profile`,
        profileData
      );
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Profile updated successfully! Response:", data);
      toast.success("Profile updated successfully!");

      // 1. Invalidate the profile query to refetch details from the server
      queryClient.invalidateQueries({ queryKey: collegeAdminKeys.profile() });

      // 2. Dispatch fetchUser to update the user object in the Redux store
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
