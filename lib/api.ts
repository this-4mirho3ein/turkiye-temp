import Axios, { AxiosResponse } from "axios";
import mainConfig from "@/configs/mainConfig";
import { errorMessage, validateMessage } from "@/utils/showMessages";

// Extend the AxiosResponse type to include the meta property
interface ExtendedAxiosResponse<T = any> extends AxiosResponse<T> {
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

const api = Axios.create({
  baseURL: mainConfig.apiServer,
  withCredentials: false, // Keep this as false to fix CORS issues
});

// Helper function to get the auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Request Interceptor for handling FormData and other requests properly
api.interceptors.request.use(
  (config) => {
    // If the request data is FormData, let the browser set the content-type automatically
    // This ensures the multipart/form-data boundary is set correctly
    if (config.data instanceof FormData) {
      // Ensure headers exist
      config.headers = config.headers || {};
      // Remove content-type so browser can set it with proper boundary
      delete config.headers["Content-Type"];
    }

    // Add auth token only to admin routes
    if (typeof window !== "undefined") {
      // Ensure we have headers object
      config.headers = config.headers || {};

      // Check if this is an admin route that requires authentication
      const isAdminRoute = config.url?.includes("/admin/");

      if (isAdminRoute) {
        const token = getAuthToken();
        if (token) {
          config.headers["x-access-token"] = token;
          // Log only for debugging
          console.log(`Added auth token to admin request: ${config.url}`);
        } else {
          console.warn(
            `No auth token available for admin request: ${config.url}`
          );
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: ExtendedAxiosResponse) => {
    // Log only for debugging API calls
    if (
      response.config.url?.includes("/api/") &&
      response.config.url?.includes("/get-")
    ) {
      console.log(`API Response for ${response.config.url}:`, response.status);
    }

    // Return the response without modification
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("Network error or no response from server", error);
      return Promise.reject({ status: 500, message: "Network error" });
    }

    const status = error.response.status;

    switch (status) {
      case 400:
        console.error("Bad Request:", error.response.data);
        validateMessage(error.response.data.message); // Show toast
        break;
      case 401:
        if (typeof window !== "undefined") {
          // window.location.href = "/auth/login"; // Redirect on Unauthorized
        }
        break;
      case 403:
        console.error("Forbidden: You do not have access.");
        if (typeof window !== "undefined") {
          window.location.href = "/403"; // Redirect to custom 403 page
        }
        break;
      case 404:
        if (typeof window !== "undefined") {
          window.location.href = "/not-found"; // Redirect on Unauthorized
        }
        console.error("Not Found:", error.response.data);
        break;
      case 500:
        console.error("Server Error:", error.response.data);
        errorMessage(error.response.data.message);
        break;
      default:
        console.error(`Unexpected Error (${status}):`, error.response.data);
    }

    return Promise.reject(error.response);
  }
);

// Error Formatter
const returnError = (err: any) => ({
  status: err?.status || 5001,
  data: err?.data || [],
  message: err?.data?.message || "An error occurred",
});

export { api, returnError };
