import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import config from "@/configs/mainConfig";

// Create a base axios instance with common settings
const apiClient = axios.create({
  baseURL: config.apiServer,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // If we're in the browser, check for auth token
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      // If there's a token, add it to the headers for all requests
      if (token) {
        config.headers["x-access-token"] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication error
    if (error.response?.status === 401) {
      // Only clear tokens and redirect if we're in a browser
      if (typeof window !== "undefined") {
        console.log("Authentication failed, clearing tokens");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("roles");

        // Redirect to login page if we're not already there
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Generic GET request
const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`GET request failed for ${url}:`, error);
    throw error;
  }
};

// Generic POST request
const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`POST request failed for ${url}:`, error);
    throw error;
  }
};

// Generic PUT request
const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`PUT request failed for ${url}:`, error);
    throw error;
  }
};

// Generic DELETE request
const remove = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    console.error(`DELETE request failed for ${url}:`, error);
    throw error;
  }
};

// Export the methods and the axios instance for direct use
export default {
  get,
  post,
  put,
  delete: remove,
  axios: apiClient,
};
