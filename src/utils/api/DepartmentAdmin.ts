import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "../axios/axios";
import type { DepartmentAdminPopulated, ApiResponse, ApiError } from "@/types";
import type { AxiosError } from "axios";
import { departmentKeys } from "./Departments";

const BASE_URL = "/departmentAdmin";

// --- Query Keys ---
export const departmentAdminKeys = {
  all: ["departmentAdmins"] as const,
  lists: () => [...departmentAdminKeys.all, "list"] as const,
  listByCollege: (collegeId: string | undefined) =>
    [...departmentAdminKeys.lists(), { collegeId }] as const,
};

// --- Default Caching Settings ---
const DEFAULT_CACHE = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
};

// --- Query Hooks (for fetching data) ---

/**
 * Fetches all department admins for a specific college.
 */
export function useGetDepartmentAdminsByCollege(
  collegeId: string | undefined,
  options: { enabled?: boolean } = {}
) {
  const { enabled = Boolean(collegeId) } = options;

  return useQuery<DepartmentAdminPopulated[], AxiosError<ApiError>>({
    queryKey: departmentAdminKeys.listByCollege(collegeId),
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<DepartmentAdminPopulated[]>>(
        `${BASE_URL}/${collegeId}`
      );
      return response.data.data;
    },
    enabled,
    ...DEFAULT_CACHE,
  });
}

// --- Mutation Hooks ---

interface CreateAdminInput {
  collegeId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  collegeAdminName: string;
}

/**
 * Hook for creating a new department admin.
 */
export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation<DepartmentAdminPopulated, AxiosError<ApiError>, CreateAdminInput>({
    mutationFn: async (adminData) => {
      const { collegeId, ...payload } = adminData;
      const response = await axiosClient.post<ApiResponse<DepartmentAdminPopulated>>(
        `${BASE_URL}/${collegeId}`,
        payload
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({
        queryKey: departmentAdminKeys.listByCollege(variables.collegeId),
      });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create admin");
    },
  });
}

interface UpdateAdminVariables {
  collegeId: string;
  adminId: string;
  data: Partial<Pick<CreateAdminInput, "name" | "phone" | "departmentId">>;
}

/**
 * Hook for updating an existing department admin.
 */
export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation<DepartmentAdminPopulated, AxiosError<ApiError>, UpdateAdminVariables>({
    mutationFn: async ({ collegeId, adminId, data }) => {
      const response = await axiosClient.patch<ApiResponse<DepartmentAdminPopulated>>(
        `${BASE_URL}/${collegeId}/${adminId}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Admin updated successfully");
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

interface DeleteAdminVariables {
  collegeId: string;
  adminId: string;
}

/**
 * Hook for deleting a department admin.
 */
export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, DeleteAdminVariables>({
    mutationFn: async ({ collegeId, adminId }) => {
      await axiosClient.delete(`${BASE_URL}/${collegeId}/${adminId}`);
    },
    onSuccess: (_, variables) => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({
        queryKey: departmentAdminKeys.listByCollege(variables.collegeId),
      });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete admin");
    },
  });
}
