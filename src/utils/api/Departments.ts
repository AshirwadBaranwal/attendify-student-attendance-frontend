import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios";
import type { Department, DepartmentPopulated, CreateDepartmentInput, UpdateDepartmentInput, ApiResponse, ApiError } from "@/types";
import type { AxiosError } from "axios";
import { departmentAdminKeys } from "./DepartmentAdmin";

const BASE_URL = "/department";

// --- Query Keys ---
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  listByCollege: (collegeId: string | undefined) =>
    [...departmentKeys.lists(), { collegeId }] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

// --- Default Caching Settings ---
const DEFAULT_CACHE = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
};

// --- Query Hooks (for fetching data) ---

interface UseGetDepartmentsByCollegeOptions extends Omit<UseQueryOptions<DepartmentPopulated[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
}

/**
 * Fetches all departments for a specific college.
 */
export function useGetDepartmentsByCollege(
  collegeId: string | undefined,
  options: UseGetDepartmentsByCollegeOptions = {}
) {
  const { enabled = Boolean(collegeId), ...restOptions } = options;

  return useQuery<DepartmentPopulated[], AxiosError<ApiError>>({
    queryKey: departmentKeys.listByCollege(collegeId),
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<DepartmentPopulated[]>>(
        `${BASE_URL}/college/${collegeId}`
      );
      return response.data.data;
    },
    enabled,
    ...DEFAULT_CACHE,
    ...restOptions,
  });
}

/**
 * Fetches a single department by its ID.
 */
export function useGetDepartmentById(
  id: string | undefined,
  options: { enabled?: boolean } = {}
) {
  const { enabled = Boolean(id) } = options;

  return useQuery<Department, AxiosError<ApiError>>({
    queryKey: departmentKeys.detail(id!),
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<Department>>(
        `${BASE_URL}/${id}`
      );
      return response.data.data;
    },
    enabled,
    ...DEFAULT_CACHE,
  });
}

// --- Mutation Hooks (for creating, updating, deleting data) ---

/**
 * Hook for creating a new department.
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation<Department, AxiosError<ApiError>, CreateDepartmentInput>({
    mutationFn: async (departmentData) => {
      const response = await axiosClient.post<ApiResponse<Department>>(
        BASE_URL,
        departmentData
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Department created successfully");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create department");
    },
  });
}

interface UpdateDepartmentVariables {
  id: string;
  data: UpdateDepartmentInput;
}

/**
 * Hook for updating an existing department.
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation<Department, AxiosError<ApiError>, UpdateDepartmentVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.patch<ApiResponse<Department>>(
        `${BASE_URL}/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Department updated successfully");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update department");
    },
  });
}

/**
 * Hook for deleting a department.
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: async (id) => {
      await axiosClient.delete(`${BASE_URL}/${id}`);
    },
    onSuccess: () => {
      toast.success("Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentAdminKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete department");
    },
  });
}
