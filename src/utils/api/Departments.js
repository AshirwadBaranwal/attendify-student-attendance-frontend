import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios"; // Assuming you have a configured axios client
import { departmentAdminKeys } from "./DepartmentAdmin";

const BASE_URL = "/department";

// --- Query Keys ---
// Centralized for better cache management and invalidation.
export const departmentKeys = {
  all: ["departments"],
  lists: () => [...departmentKeys.all, "list"],
  listByCollege: (collegeId) => [...departmentKeys.lists(), { collegeId }],
  details: () => [...departmentKeys.all, "detail"],
  detail: (id) => [...departmentKeys.details(), id],
};

// --- Default Caching Settings ---
const DEFAULT_CACHE = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
};

// --- Query Hooks (for fetching data) ---

/**
 * @description Fetches all departments for a specific college.
 * @param {string} collegeId - The ID of the college.
 * @param {object} options - Optional TanStack Query options.
 */

export function useGetDepartmentsByCollege(collegeId, options = {}) {
  // The query will only run if a collegeId is provided.
  const { enabled = Boolean(collegeId) } = options;

  return useQuery({
    queryKey: departmentKeys.listByCollege(collegeId),
    queryFn: async () => {
      const response = await axiosClient.get(
        `${BASE_URL}/college/${collegeId}`
      );
      return response.data;
    },
    enabled,
    ...DEFAULT_CACHE,
  });
}

/**
 * @description Fetches a single department by its ID.
 * @param {string} id - The ID of the department.
 * @param {object} options - Optional TanStack Query options.
 */

export function useGetDepartmentById(id, options = {}) {
  // The query will only run if an ID is provided.
  const { enabled = Boolean(id) } = options;

  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const response = await axiosClient.get(`${BASE_URL}/${id}`);
      return response.data;
    },
    enabled,
    ...DEFAULT_CACHE,
  });
}

// --- Mutation Hooks (for creating, updating, deleting data) ---

/**
 * @description Hook for creating a new department.
 */

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (departmentData) => {
      const response = await axiosClient.post(BASE_URL, departmentData);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Department created successfully");
      // Invalidate all department list queries to refetch the updated list.
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create department"
      );
    },
  });
}

/**
 * @description Hook for updating an existing department.
 */

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.patch(`${BASE_URL}/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Department updated successfully");
      // Invalidate all list queries.
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      // Invalidate the specific detail query for the updated department.
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update department"
      );
    },
  });
}

/**
 * @description Hook for deleting a department.
 */

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosClient.delete(`${BASE_URL}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Department deleted successfully");
      // Invalidate all department list queries to reflect the deletion.
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentAdminKeys.lists() });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    },
  });
}
