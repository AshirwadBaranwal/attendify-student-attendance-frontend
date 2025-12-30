import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "@/types";

// =============================================================================
// Configuration
// =============================================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// =============================================================================
// Token Refresh Logic
// =============================================================================

type OriginalRequest = InternalAxiosRequestConfig & { _retry?: boolean };
type QueuedRequest = { resolve: (v?: unknown) => void; reject: (e?: unknown) => void };

// Error codes that trigger token refresh or require login redirect
const TOKEN_EXPIRED_CODES = ["TOKEN_EXPIRED", "TOKEN_VERSION_MISMATCH"];
const REFRESH_INVALID_CODES = ["INVALID_REFRESH_TOKEN", "NO_REFRESH_TOKEN"];

let isRefreshing = false;
let isRedirecting = false;
let failedQueue: QueuedRequest[] = [];

const getErrorCode = (error: AxiosError): string | undefined =>
  (error.response?.data as { code?: string })?.code;

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((req) => (error ? req.reject(error) : req.resolve()));
  failedQueue = [];
};

const redirectToLogin = () => {
  const canRedirect =
    typeof window !== "undefined" &&
    !isRedirecting &&
    !window.location.pathname.includes("/login");

  if (canRedirect) {
    isRedirecting = true;
    window.location.href = "/login";
  }
};

const queueRequest = (originalRequest: OriginalRequest): Promise<unknown> =>
  new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then(() => axiosClient(originalRequest));

const attemptTokenRefresh = async (originalRequest: OriginalRequest) => {
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    await axiosClient.post("/auth/college-admin/refresh-token");
    processQueue();
    return axiosClient(originalRequest);
  } catch (error) {
    processQueue(error as AxiosError);
    redirectToLogin();
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// =============================================================================
// Response Interceptor
// =============================================================================

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as OriginalRequest;
    const errorCode = getErrorCode(error);
    const is401 = error.response?.status === 401;

    // Skip interceptor for refresh-token endpoint to prevent infinite loop
    if (originalRequest?.url?.includes("refresh-token")) {
      return Promise.reject(error);
    }

    // Invalid refresh token → redirect to login
    if (is401 && errorCode && REFRESH_INVALID_CODES.includes(errorCode)) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Access token expired → attempt refresh
    if (is401 && errorCode && TOKEN_EXPIRED_CODES.includes(errorCode) && !originalRequest._retry) {
      return isRefreshing
        ? queueRequest(originalRequest)
        : attemptTokenRefresh(originalRequest);
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// Type-Safe API Helpers
// =============================================================================

export const apiGet = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.get(url);
  return response.data.data;
};

export const apiPost = async <T, D = unknown>(url: string, data?: D): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.post(url, data);
  return response.data.data;
};

export const apiPatch = async <T, D = unknown>(url: string, data?: D): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.patch(url, data);
  return response.data.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosClient.delete(url);
  return response.data.data;
};

// =============================================================================
// Exports
// =============================================================================

export type { AxiosError };
export default axiosClient;
