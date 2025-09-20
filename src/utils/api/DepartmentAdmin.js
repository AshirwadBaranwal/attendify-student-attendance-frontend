import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios"; // Assuming you have a configured axios client
import { departmentKeys } from "./Departments";

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
  const { enabled = Boolean(collegeId) } = options;

  return useQuery({
    queryKey: departmentAdminKeys.listByCollege(collegeId),
    queryFn: async () => {
      // The response.data is returned directly by the axios client interceptor
      const { data } = await axiosClient.get(`${BASE_URL}/${collegeId}`);
      return data;
    },
    enabled,
    ...DEFAULT_CACHE,
  });
}

// --- Mutation Hooks (for creating, updating, deleting data) ---

/**
 * @description Hook for creating a new department admin.
 */
export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminData) => {
      const { collegeId, ...payload } = adminData;
      const response = await axiosClient.post(
        `${BASE_URL}/${collegeId}`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Admin created successfully");
      // Invalidate the list for the specific college to refetch.
      queryClient.invalidateQueries({
        queryKey: departmentAdminKeys.listByCollege(variables.collegeId),
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create admin");
    },
  });
}

/**
 * @description Hook for updating an existing department admin.
 */
export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collegeId, adminId, data }) => {
      const response = await axiosClient.patch(
        `${BASE_URL}/${collegeId}/${adminId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Admin updated successfully");
      // Invalidate the specific list query to refetch the updated admin list.
      queryClient.invalidateQueries({
        queryKey: departmentAdminKeys.listByCollege(variables.collegeId),
      });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update admin");
    },
  });
}

/**
 * @description Hook for deleting a department admin with optimistic updates.
 */
export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collegeId, adminId }) => {
      const response = await axiosClient.delete(
        `${BASE_URL}/${collegeId}/${adminId}`
      );
      return response.data;
    },
    onMutate: async ({ collegeId, adminId }) => {
      // Cancel any outgoing refetches to prevent overwriting our optimistic update.
      await queryClient.cancelQueries({
        queryKey: departmentAdminKeys.listByCollege(collegeId),
      });

      // Snapshot the previous value.
      const previousAdmins = queryClient.getQueryData(
        departmentAdminKeys.listByCollege(collegeId)
      );

      // Optimistically update to the new value by removing the item.
      queryClient.setQueryData(
        departmentAdminKeys.listByCollege(collegeId),
        (oldData) =>
          oldData ? oldData.filter((admin) => admin._id !== adminId) : []
      );

      // Return a context object with the snapshotted value.
      return { previousAdmins, collegeId };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back to the previous state.
      if (context?.previousAdmins) {
        queryClient.setQueryData(
          departmentAdminKeys.listByCollege(context.collegeId),
          context.previousAdmins
        );
      }
      toast.error(error.response?.data?.message || "Failed to delete admin");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success("Admin deleted successfully");
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure data consistency.
      queryClient.invalidateQueries({
        queryKey: departmentAdminKeys.listByCollege(variables.collegeId),
      });
    },
  });
}
