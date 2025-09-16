import axios from "axios";
import { toast } from "sonner";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // Crucial for sending/receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// // Add a response interceptor to handle common errors
// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.error("Axios error:", error);

//     // Handle specific error cases
//     if (error.response) {
//       console.error(`Error response from ${error.config?.url}:`, {
//         status: error.response.status,
//         data: error.response.data,
//         headers: error.response.headers,
//       });

//       // Server responded with an error status
//       if (error.response.status === 401) {
//         // Unauthorized - could redirect to login or show a message
//         if (
//           window.location.pathname !== "/login" &&
//           window.location.pathname !== "/verify-email"
//         ) {
//           localStorage.setItem("authRedirect", window.location.pathname);
//           toast.error("Session expired. Please login again.");
//           // Use setTimeout to allow the console logs to be captured before redirecting
//           setTimeout(() => {
//             window.location.href = "/login";
//           }, 100);
//         }
//       } else if (error.response.status === 403) {
//         // Forbidden
//         toast.error("You don't have permission to access this resource.");
//       } else if (error.response.status === 500) {
//         // Server error
//         toast.error("Server error. Please try again later.");
//       }
//     } else if (error.request) {
//       // Request made but no response received
//       console.error("No response received:", error.request);
//       toast.error("No response from server. Please check your connection.");
//     } else {
//       // Something else happened
//       console.error("Error message:", error.message);
//       toast.error("An error occurred. Please try again.");
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosClient;
