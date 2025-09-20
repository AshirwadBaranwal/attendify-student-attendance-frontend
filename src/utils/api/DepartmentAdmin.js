import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios"; // Assuming you have a configured axios client

// This base URL should match how you mount `deaprtmentAdminRouter` in your main Express app.
// For example: app.use("/college-admin/department-admins", deaprtmentAdminRouter);
const BASE_URL = "/departmentAdmin/college-admin";

// --- Query Keys ---
// Centralized for better cache management and invalidation.
export const departmentAdminKeys = {
  all: ["departmentAdmins"],
  lists: () => [...departmentAdminKeys.all, "list"],
  listByCollege: (collegeId) => [...departmentAdminKeys.lists(), { collegeId }],
};

// --- Default Caching Settings ---
const DEFAULT_CACHE = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
};

// --- Query Hooks (for fetching data) ---

/**
 * @description Fetches all department admins for a specific college.
 * @param {string} collegeId - The ID of the college.
 * @param {object} options - Optional TanStack Query options.
 */
export function useGetDepartmentAdminsByCollege(collegeId, options = {}) {
  // The query will only run if a collegeId is provided.
  const { enabled = Boolean(collegeId) } = options;

  return useQuery({
    queryKey: departmentAdminKeys.listByCollege(collegeId),
    queryFn: async () => {
      // Corresponds to: GET /:collegeId
      const response = await axiosClient.get(`${BASE_URL}/${collegeId}`);
      return response.data;
    },
    enabled,
    ...DEFAULT_CACHE,
  });
}

// --- Mutation Hooks (for creating data) ---

/**
 * @description Hook for creating a new department admin.
 */
export function useCreateDepartmentAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collegeId, adminData }) => {
      // Corresponds to: POST /:collegeId
      // `collegeId` goes into the URL, the rest of the data goes in the body.
      const response = await axiosClient.post(
        `${BASE_URL}/${collegeId}`,
        adminData
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Department Admin created successfully. Invitation sent.");
      // Invalidate the list of admins for the specific college to trigger a refetch.
      queryClient.invalidateQueries({
        queryKey: departmentAdminKeys.listByCollege(variables.collegeId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create department admin"
      );
    },
  });
}
