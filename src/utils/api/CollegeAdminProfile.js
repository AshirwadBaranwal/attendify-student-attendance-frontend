import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios";
import { fetchUser } from "@/redux/features/user/userSlice";
import { useDispatch } from "react-redux"; // 1. Import useDispatch

const BASE_URL = "/profile/college-admin";

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
