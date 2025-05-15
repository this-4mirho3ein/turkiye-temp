import axios from "axios";
import config from "@/configs/mainConfig";

// Create an axios instance with the base URL from config
const apiClient = axios.create({
  baseURL: config.apiServer,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in admin routes
apiClient.interceptors.request.use(
  (config) => {
    // Check if the request URL includes /admin
    if (config.url?.includes("/admin") || config.url?.includes("/api")) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["x-access-token"] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Type definitions
export interface LoginRequest {
  phone: string;
  activationCode: string;
}

export interface SendLoginCodeRequest {
  phone: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  success: boolean;
  data?: T;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  roles: string[];
  userId: string;
  wallet: number;
  sessionId: string;
}

// Authentication service functions
const adminAuthService = {
  /**
   * Send login code to admin's phone number
   * @param phoneNumber - Phone number to send verification code to
   */
  sendLoginCode: async (phoneNumber: string): Promise<ApiResponse> => {
    try {
      console.log("Sending login code API request with phone:", phoneNumber);

      // The server expects the request body in this format: { "phone": "9123456789" }
      const response = await apiClient.post<ApiResponse>(
        "/api/auth/send-login-code",
        {
          phone: phoneNumber,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse;
      }
      return {
        status: 500,
        message: "خطا در برقراری ارتباط با سرور",
        success: false,
      };
    }
  },

  /**
   * Login with phone number and verification code
   * @param phoneNumber - Phone number that received the verification code
   * @param activationCode - Verification code received
   */
  login: async (
    phoneNumber: string,
    activationCode: string
  ): Promise<ApiResponse<AuthData>> => {
    try {
      console.log(
        `Login API request with phone: ${phoneNumber}, code: ${activationCode}`
      );

      // The server expects the request body in this format:
      // { "phone": "9123456789", "activationCode": "123456" }
      const response = await apiClient.post<ApiResponse<AuthData>>(
        "/api/auth/login",
        {
          phone: phoneNumber,
          activationCode: activationCode,
        }
      );

      // If login is successful, store auth tokens
      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, roles, userId, sessionId } =
          response.data.data;

        // Store tokens and user data in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("roles", JSON.stringify(roles));

        console.log("Login successful. Tokens stored.");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<AuthData>;
      }
      return {
        status: 500,
        message: "خطا در برقراری ارتباط با سرور",
        success: false,
      };
    }
  },

  /**
   * Check if admin is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Get the current auth token
   */
  getAuthToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  /**
   * Get user roles
   */
  getUserRoles: (): string[] => {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : [];
  },

  /**
   * Logout admin
   */
  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("roles");
  },
};

export default adminAuthService;
