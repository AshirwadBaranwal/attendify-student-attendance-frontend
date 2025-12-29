import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Crucial for sending/receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// Type-safe API helpers
// ============================================================================

/**
 * Generic GET request with type safety
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.get(url);
  return response.data.data;
}

/**
 * Generic POST request with type safety
 */
export async function apiPost<T, D = unknown>(url: string, data?: D): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.post(url, data);
  return response.data.data;
}

/**
 * Generic PATCH request with type safety
 */
export async function apiPatch<T, D = unknown>(url: string, data?: D): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.patch(url, data);
  return response.data.data;
}

/**
 * Generic DELETE request with type safety
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.delete(url);
  return response.data.data;
}

// Re-export for convenience
export type { AxiosError };
export default axiosClient;
