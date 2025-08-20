import { PlanListItem } from "@/components/admin/plans/Plan";
import {
  CreatePlanPayload,
  UpdatePlanPayload,
} from "@/components/admin/plans/PlansList";
import mainConfig from "@/configs/mainConfig";
import axios from "axios";

// Create a reusable axios instance with base URL and default config
const api = axios.create({
  baseURL: mainConfig.apiServer,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: any) => {
    // Get token from localStorage if we're in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["x-access-token"] = token;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response: any) => {
    // Return successful responses as-is
    return response;
  },
  (error: any) => {
    // Handle authentication error (401)
    if (error.response?.status === 401) {
      // Only clear tokens and redirect if we're in a browser
      if (typeof window !== "undefined") {

        // Clear all authentication data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("roles");
        localStorage.removeItem("userData");

        // Clear session storage flags
        sessionStorage.removeItem("isAuthenticating");
        sessionStorage.removeItem("loginPhone");

        // Clear any cookies
        if (typeof document !== "undefined") {
          // Simple cookie clearing - set expiry to past date
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // Redirect to login page if we're not already there
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }

    // Always reject the promise to let the calling code handle the error
    return Promise.reject(error);
  }
);

//#region AdminRegions
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  status?: number;
}

// Helper function to handle 401 redirects
const handle401Redirect = () => {
  // Only clear tokens and redirect if we're in a browser
  if (typeof window !== "undefined") {

    // Clear all authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("roles");
    localStorage.removeItem("userData");

    // Clear session storage flags
    sessionStorage.removeItem("isAuthenticating");
    sessionStorage.removeItem("loginPhone");

    // Clear any cookies
    if (typeof document !== "undefined") {
      // Simple cookie clearing - set expiry to past date
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Redirect to login page if we're not already there
    if (!window.location.pathname.includes("/admin/login")) {
      window.location.href = "/admin/login";
    }
  }
};

// Get Agency Details by ID
export const getAgencyDetails = async (id: string): Promise<ApiResponse> => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(`/admin/agency/get-agency/${id}`, {
      headers,
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return returnError(error);
  }
};

// Get Agency Members
export const getAgencyMembers = async (id: string): Promise<ApiResponse> => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(`/admin/agency/get-members/${id}`, {
      headers,
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return returnError(error);
  }
};

// Add area admin to an agency
export const addAgencyAreaAdmin = async (
  agencyId: string,
  phone: string
): Promise<ApiResponse> => {
  try {

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Format the request body
    const requestBody = {
      agencyId,
      countryCode: "98",
      phone,
      message: "Agency has been verified and confirmed",
    };

    const response = await api.post(
      `/admin/agency/add-area_admin`,
      requestBody,
      { headers }
    );


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مدیر منطقه با موفقیت اضافه شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {


      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در حذف مدیر منطقه",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } 

    return returnError(error);
  }
};

// Remove area admin from an agency
export const removeAgencyAreaAdmin = async (
  agencyId: string,
  adminId: string
): Promise<ApiResponse> => {
  try {

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Format the request body
    const requestBody = {
      agencyId,
      adminId,
    };

    const response = await api.delete(`/admin/agency/remove-area_admin`, {
      headers,
      data: requestBody, // For DELETE requests, the body goes in the 'data' property
    });


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مدیر منطقه با موفقیت حذف شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {

      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در حذف مدیر منطقه",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } 

    return returnError(error);
  }
};

// Add consultant to an agency
export const addAgencyConsultant = async (
  agencyId: string,
  phone: string
): Promise<ApiResponse> => {
  try {

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Format the request body
    const requestBody = {
      agencyId,
      countryCode: "98",
      phone,
      message: "Agency has been verified and confirmed",
    };

    const response = await api.post(
      `/admin/agency/add-consultant`,
      requestBody,
      { headers }
    );


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مشاور با موفقیت اضافه شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در افزودن مشاور",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } 

    return returnError(error);
  }
};

// Remove consultant from an agency
export const removeAgencyConsultant = async (
  agencyId: string,
  consultantId: string
): Promise<ApiResponse> => {
  try {

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Format the request body
    const requestBody = {
      agencyId,
      consultantId,
    };

    const response = await api.delete(`/admin/agency/remove-consultant`, {
      headers,
      data: requestBody, // For DELETE requests, the body goes in the 'data' property
    });


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مشاور با موفقیت حذف شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در حذف مشاور",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } 

    return returnError(error);
  }
};

// Get agency verifications with pagination and status filtering
export const getAgencyVerifications = async (
  status: string = "pending",
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse> => {
  try {

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(
      `/admin/agency/verifications?status=${status}&page=${page}&limit=${limit}`,
      { headers }
    );


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "لیست تأییدیه‌ها با موفقیت دریافت شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message:
            error.response.data.message || "خطا در دریافت لیست تأییدیه‌ها",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
      } 

    return returnError(error);
  }
};

// Get agency verification documents
export const getAgencyVerificationDocuments = async (
  id: string
): Promise<ApiResponse> => {
  try {

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(
      `/admin/agency/verification/documents/${id}`,
      { headers }
    );


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "اطلاعات مدارک با موفقیت دریافت شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در دریافت اطلاعات مدارک",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } 

    return returnError(error);
  }
};

/**
 * Review agency verification documents
 *
 * This function sends a review action for agency verification documents to the API.
 * It supports various actions like approve, reject, request_more_info, and review_document.
 *
 * @param reviewData - Object containing review information
 * @param reviewData.agencyId - ID of the agency being reviewed
 * @param reviewData.action - Type of review action (approve, reject, request_more_info, review_document)
 * @param reviewData.documentIds - Single document ID or array of document IDs to review
 * @param reviewData.rejectionReason - Optional reason for rejection (required for 'reject' action)
 * @param reviewData.documentNotes - Optional notes about the document review
 * @returns Promise with API response
 */
export const reviewAgencyVerification = async (reviewData: {
  agencyId: string;
  action: "approved" | "rejected" | "request_more_info" | "review_document";
  documentIds: string | string[];
  rejectionReason?: string;
  documentNotes?: string;
}): Promise<ApiResponse> => {
  try {

    // Format document IDs to array if it's a string
    const documentIds = Array.isArray(reviewData.documentIds)
      ? reviewData.documentIds
      : [reviewData.documentIds];

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Prepare request body
    const requestBody = {
      agencyId: reviewData.agencyId,
      action: reviewData.action,
      documentIds: documentIds,
      rejectionReason: reviewData.rejectionReason || "",
      documentNotes: reviewData.documentNotes || "",
    };


    const response = await api.post(
      `/admin/agency/verification/review`,
      requestBody,
      { headers }
    );


    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "بررسی مدارک با موفقیت انجام شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {

    // Add more detailed error logging
    if (error.response) {

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در بررسی مدارک",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
      } 

    return returnError(error);
  }
};

// Helper function to handle API errors
const returnError = (error: any): ApiResponse => {
  if (error.response) {
    // Check for 401 status code and handle redirect
    if (error.response.status === 401) {
      handle401Redirect();
    }

    // The request was made and the server responded with a status code outside the 2xx range
    return {
      success: false,
      message:
        error.response.data?.message ||
        "An error occurred with the server response",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message: "No response received from server",
      status: 0,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      success: false,
      message: error.message || "An unknown error occurred",
      status: 500,
    };
  }
};

// Admin Agencies
export const getAdminAgencies = async (
  params: {
    page?: number;
    limit?: number;
    forceRefresh?: boolean;
    name?: string;
    province?: string;
    city?: string;
    area?: string;
    isVerified?: boolean;
    isActive?: boolean;
    sortField?: string;
    sortOrder?: number;
  } = {}
): Promise<ApiResponse> => {
  const {
    page = 1,
    limit = 10,
    forceRefresh = false,
    name,
    province,
    city,
    area,
    isVerified,
    isActive,
    sortField = "createdAt",
    sortOrder = -1,
  } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  // Build query parameters
  let queryParams = `page=${page}&limit=${limit}`;

  // Add filter parameters if they exist
  if (name) queryParams += `&name=${encodeURIComponent(name)}`;
  if (province) queryParams += `&province=${encodeURIComponent(province)}`;
  if (city) queryParams += `&city=${encodeURIComponent(city)}`;
  if (area) queryParams += `&area=${encodeURIComponent(area)}`;
  if (isVerified !== undefined) queryParams += `&isVerified=${isVerified}`;
  if (isActive !== undefined) queryParams += `&isActive=${isActive}`;
  if (sortField) queryParams += `&sortField=${sortField}`;
  if (sortOrder !== undefined) queryParams += `&sortOrder=${sortOrder}`;

  try {
    const apiUrl = `/admin/agency/get-all-agencies?${queryParams}${cacheParam}`;

    const response = await api.get(apiUrl);


    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (err: any) {

    // Fallback to direct Axios call if the api instance fails
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/agency/get-all-agencies?${queryParams}${cacheParam}`,
        {
          headers,
          withCredentials: false,
        }
      );

      return {
        success: true,
        data: directResponse.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.message || "Failed to fetch agencies",
        status: err.response?.status || 500,
      };
    }
  }
};

// --- Province ---
export const getAdminProvinces = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  // Ensure limit is not greater than 100 (backend restriction)
  const {
    page = 1,
    limit: requestedLimit = 100,
    forceRefresh = false,
  } = params;
  const limit = Math.min(requestedLimit, 100);

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    // Get token from localStorage if in browser environment
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(
      `/admin/province/get-provinces?page=${page}&limit=${limit}${cacheParam}`,
      { headers }
    );

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    } else if (Array.isArray(response.data)) {
      data = response.data;
    }
    return data || [];
  } catch (err) {
    console.error("Error fetching provinces:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      // Get token from localStorage if in browser environment
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/province/get-provinces?page=${page}&limit=${limit}${cacheParam}`,
        {
          headers,
          withCredentials: false,
        }
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data?.data &&
        Array.isArray(directResponse.data.data.data)
      ) {
        directData = directResponse.data.data.data;
      } else if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      }
      return directData || [];
    } catch (fallbackErr) {
      console.error("Direct provinces fallback also failed:", fallbackErr);
      return [];
    }
  }
};

export const createAdminProvince = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/province/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "Province created successfully",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/province/create`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "Province created successfully",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create province",
      };
    }
  }
};

export const updateAdminProvince = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/province/update/${id}`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "Province updated successfully",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/province/update/${id}`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "Province updated successfully",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update province",
      };
    }
  }
};

export const deleteAdminProvince = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/admin/province/delete/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "Province deleted successfully",
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/admin/province/delete/${id}`,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "Province deleted successfully",
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete province",
      };
    }
  }
};

// --- City ---
export const getAdminCities = async (
  params: {
    page?: number;
    limit?: number;
    forceRefresh?: boolean;
    province?: string;
  } = {}
): Promise<any[]> => {
  // Ensure limit is not greater than 100 (backend restriction)
  const {
    page = 1,
    limit: requestedLimit = 100,
    forceRefresh = false,
    province,
  } = params;
  const limit = Math.min(requestedLimit, 100);

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  // Add a default filter object to avoid "filter is not defined" error
  const filterParam = `&filter=${encodeURIComponent(JSON.stringify({}))}`;

  try {
    // Get token from localStorage if in browser environment
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    console.log(
      `🏙️ Fetching cities with page=${page}, limit=${limit}${
        province ? ", province=" + province : ""
      }`
    );

    const response = await api.get(
      `/admin/city/get-cities?page=${page}&limit=${limit}${filterParam}${cacheParam}`,
      { headers }
    );

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    } else if (Array.isArray(response.data)) {
      data = response.data;
    }
    return data || [];
  } catch (err) {
    console.error("Error fetching cities:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      // Get token from localStorage if in browser environment
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      console.log(
        `🏙️ Fallback: Fetching cities with page=${page}, limit=${limit}${filterParam}`
      );

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/city/get-cities?page=${page}&limit=${limit}${filterParam}${cacheParam}`,
        {
          headers,
          withCredentials: false,
        }
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data?.data &&
        Array.isArray(directResponse.data.data.data)
      ) {
        directData = directResponse.data.data.data;
      } else if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      }
      return directData || [];
    } catch (fallbackErr) {
      console.error("Direct cities fallback also failed:", fallbackErr);
      return [];
    }
  }
};

export const createAdminCity = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/city/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "City created successfully",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/city/create`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "City created successfully",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create city",
      };
    }
  }
};

export const updateAdminCity = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/city/update/${id}`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "City updated successfully",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/city/update/${id}`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "City updated successfully",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update city",
      };
    }
  }
};

export const deleteAdminCity = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/admin/city/delete/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "City deleted successfully",
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/admin/city/delete/${id}`,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "City deleted successfully",
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete city",
      };
    }
  }
};

// --- Area ---
export const getAdminAreas = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  // Ensure limit is not greater than 100 (backend restriction)
  const {
    page = 1,
    limit: requestedLimit = 100,
    forceRefresh = false,
  } = params;
  const limit = Math.min(requestedLimit, 100);

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    // Get token from localStorage if in browser environment
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(
      `/admin/area/get-areas?page=${page}&limit=${limit}${cacheParam}`,
      { headers }
    );

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    } else if (Array.isArray(response.data)) {
      data = response.data;
    }
    return data || [];
  } catch (err) {
    console.error("Error fetching areas:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      // Get token from localStorage if in browser environment
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/area/get-areas?page=${page}&limit=${limit}${cacheParam}`,
        {
          headers,
          withCredentials: false,
        }
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data?.data &&
        Array.isArray(directResponse.data.data.data)
      ) {
        directData = directResponse.data.data.data;
      } else if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      }
      return directData || [];
    } catch (fallbackErr) {
      console.error("Direct areas fallback also failed:", fallbackErr);
      return [];
    }
  }
};

export const createAdminArea = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/area/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "Area created successfully",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/area/create`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "Area created successfully",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create area",
      };
    }
  }
};

export const updateAdminArea = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/area/update/${id}`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "Area updated successfully",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/area/update/${id}`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "Area updated successfully",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update area",
      };
    }
  }
};

export const deleteAdminArea = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/admin/area/delete/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "Area deleted successfully",
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/admin/area/delete/${id}`,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "Area deleted successfully",
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete area",
      };
    }
  }
};

//#endregion

//#region AdminUsers
export const getAdminUsers = async (
  params: {
    page?: number;
    limit?: number;
    forceRefresh?: boolean;
    roles?: string;
    isActive?: boolean;
    isBanned?: boolean;
    isProfileComplete?: boolean;
    search?: string;
  } = {}
): Promise<any[]> => {
  const {
    page = 1,
    limit = 100,
    forceRefresh = false,
    roles,
    isActive,
    isBanned,
    isProfileComplete,
    search,
  } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  // Build query parameters for filters
  let queryParams = `page=${page}&limit=${limit}${cacheParam}`;

  // Add filter parameters if they exist
  if (roles) queryParams += `&roles=${roles}`;
  if (isActive !== undefined) queryParams += `&isActive=${isActive}`;
  if (isBanned !== undefined) queryParams += `&isBanned=${isBanned}`;
  if (isProfileComplete !== undefined)
    queryParams += `&isProfileComplete=${isProfileComplete}`;
  if (search) queryParams += `&search=${encodeURIComponent(search)}`;

  try {
    console.log(`🔍 Fetching admin users with filters:`, {
      page,
      limit,
      forceRefresh,
      roles,
      isActive,
      isBanned,
      isProfileComplete,
      search,
    });
    console.log(`🔍 API request URL: /admin/user/get-users?${queryParams}`);

    // Get authentication token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    // Add headers with authentication token if available
    const headers: Record<string, string> = {};
    if (token) {
      headers["x-access-token"] = token;
    }

    const response = await api.get(`/admin/user/get-users?${queryParams}`, {
      headers,
    });

    console.log("🔍 Admin users API response status:", response.status);

    // Log the filtered results count
    if (response.data?.data && Array.isArray(response.data.data)) {
      console.log(
        `🔍 Filtered results: ${response.data.data.length} users found`
      );
    } else if (Array.isArray(response.data)) {
      console.log(`🔍 Filtered results: ${response.data.length} users found`);
    }

    console.log(
      "🔍 Admin users API response data:",
      JSON.stringify(response.data, null, 2)
    );

    // Log data summary
    const dataStructureSummary = {
      hasData: !!response.data,
      isDataObject: response.data && typeof response.data === "object",
      hasDataData: response.data?.data !== undefined,
      isDataDataArray: response.data?.data && Array.isArray(response.data.data),
      dataDataLength:
        response.data?.data && Array.isArray(response.data.data)
          ? response.data.data.length
          : "N/A",
    };
    console.log("🔍 Data structure summary:", dataStructureSummary);

    // Handle different possible response structures to extract the users array
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === "object") {
      // If the API returns {status, data, message, success} format
      // Return the entire response for the component to handle
      return response.data;
    } else {
      return [];
    }
  } catch (err) {
    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for users...");

      // Get authentication token
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      // Create headers with token
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["x-access-token"] = token;
      }

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/user/get-users?${queryParams}`,
        {
          headers,
          withCredentials: false,
        }
      );

      console.log("⚙️ Direct users request status:", directResponse.status);
      console.log(
        "⚙️ Direct users request data:",
        JSON.stringify(directResponse.data, null, 2)
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      } else {
      }

      return directData || [];
    } catch (fallbackErr) {
      return [];
    }
  }
};

export const createAdminUser = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/user/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "کاربر با موفقیت ایجاد شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/user/create`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "کاربر با موفقیت ایجاد شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "ایجاد کاربر با خطا مواجه شد",
      };
    }
  }
};

export const updateAdminUser = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  console.log("updateAdminUser function called with id:", id);
  console.log("updateAdminUser data:", JSON.stringify(data, null, 2));

  try {
    // Ensure the ID is included in the data object
    const requestData = { ...data, id };

    console.log(
      `🔄 Updating user with data:`,
      JSON.stringify(requestData, null, 2)
    );
    // The endpoint doesn't need the ID as part of the URL - it's in the request body
    console.log(`Attempting PUT request to /admin/user/update-user`);
    console.log(`Full URL: ${mainConfig.apiServer}/admin/user/update-user`);

    const response = await api.put(`/admin/user/update-user`, requestData);
    console.log(`PUT request successful with status: ${response.status}`);
    console.log(`f504 Update response:`, response.status, response.data);
    console.log(
      `f504 Response message:`,
      response.data?.message || "کاربر با موفقیت به‌روزرسانی شد"
    );
    return {
      success: response.data.success,
      message: response.data?.message || "کاربر با موفقیت به‌روزرسانی شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    if (err.response) {
      console.error(`Error response status:`, err.response.status);
      console.error(`Error response data:`, err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(`⚙️ Attempting direct Axios fallback for updating user...`);

      // Get the auth token for the fallback request
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      // Ensure the ID is included in the fallback request data as well
      const fallbackRequestData = { ...data, id };

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/user/update-user`,
        fallbackRequestData,
        {
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        }
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "کاربر با موفقیت به‌روزرسانی شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      if (fallbackErr.response) {
        console.error(
          `Fallback error response status:`,
          fallbackErr.response.status
        );
        console.error(
          `Fallback error response data:`,
          fallbackErr.response.data
        );
      }
      return {
        success: false,
        message:
          err.response?.data?.message || "به‌روزرسانی کاربر با خطا مواجه شد",
      };
    }
  }
};

export const deleteAdminUser = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🗑️ Deleting user with ID: ${id}`);
    const response = await api.delete(`/admin/user/delete-user/${id}`);
    console.log(`🗑️ Delete response status: ${response.status}`);
    console.log(`🗑️ Delete response data:`, response.data);

    return {
      success: response.data.success,
      message: response.data?.message || "کاربر با موفقیت حذف شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    if (err.response) {
      console.error(`Error response status:`, err.response.status);
      console.error(`Error response data:`, err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(
        `⚙️ Attempting direct Axios fallback for deleting user ${id}...`
      );
      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/admin/user/delete-user/${id}`,
        {
          withCredentials: false,
        }
      );
      console.log(`⚙️ Direct delete response status: ${directResponse.status}`);
      console.log(`⚙️ Direct delete response data:`, directResponse.data);

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "کاربر با موفقیت حذف شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "حذف کاربر با خطا مواجه شد",
      };
    }
  }
};

export const restoreAdminUser = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🔄 Restoring user with ID: ${id}`);
    const response = await api.put(`/admin/user/restore-user/${id}`);
    console.log(`🔄 Restore response status: ${response.status}`);
    console.log(`🔄 Restore response data:`, response.data);

    return {
      success: response.data.success,
      message: response.data?.message || "کاربر با موفقیت بازیابی شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    if (err.response) {
      console.error(`Error response status:`, err.response.status);
      console.error(`Error response data:`, err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(
        `⚙️ Attempting direct Axios fallback for restoring user ${id}...`
      );

      // Get the auth token for the fallback request
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/user/restore-user/${id}`,
        {},
        {
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "کاربر با موفقیت بازیابی شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: err.response?.data?.message || "بازیابی کاربر با خطا مواجه شد",
      };
    }
  }
};

// Get a specific admin user by ID
export const getAdminUserById = async (id: string): Promise<ApiResponse> => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      return {
        success: false,
        message: "توکن احراز هویت یافت نشد",
      };
    }

    console.log(`🔍 Fetching user details for ID: ${id}`);

    // Try with the standard endpoint format first
    try {
      const response = await api.get(`/admin/user/get-user/${id}`, {
        headers: {
          "x-access-token": token,
        },
      });

      console.log(`🔍 User details response:`, response.status, response.data);

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "اطلاعات کاربر با موفقیت دریافت شد",
      };
    } catch (endpointError: any) {
      console.log(
        `⚠️ First endpoint attempt failed, trying alternative format...`
      );

      // If the first endpoint fails, try a direct Axios call with different format
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/user/get-user/${id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log(
        `🔍 Direct user details response:`,
        directResponse.status,
        directResponse.data
      );

      return {
        success: true,
        data: directResponse.data.data || directResponse.data,
        message:
          directResponse.data.message || "اطلاعات کاربر با موفقیت دریافت شد",
      };
    }
  } catch (error: any) {
    console.error("Error fetching admin user details:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Request URL:", error.config?.url);
      console.error("Request headers:", error.config?.headers);
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    // Return structured error response
    return {
      success: false,
      message: error.response?.data?.message || "خطا در دریافت اطلاعات کاربر",
      status: error.response?.status,
    };
  }
};

// Get current user profile by ID
export const getCurrentUserProfile = async (
  userId: string
): Promise<ApiResponse> => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      return {
        success: false,
        message: "توکن احراز هویت یافت نشد",
      };
    }

    console.log(`🔍 Fetching current user profile for ID: ${userId}`);

    const response = await api.get(`/admin/user/get-user/${userId}`, {
      headers: {
        "x-access-token": token,
      },
    });

    console.log(
      `🔍 Current user profile response:`,
      response.status,
      response.data
    );

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "اطلاعات پروفایل با موفقیت دریافت شد",
      status: response.status,
    };
  } catch (error: any) {
    console.error("Error fetching current user profile:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(
        "⚙️ Attempting direct Axios fallback for current user profile..."
      );

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/user/get-user/${userId}`,
        {
          headers: {
            "x-access-token": token || "",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `⚙️ Direct current user profile response:`,
        directResponse.status,
        directResponse.data
      );

      return {
        success: true,
        data: directResponse.data.data || directResponse.data,
        message:
          directResponse.data.message || "اطلاعات پروفایل با موفقیت دریافت شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "خطا در دریافت اطلاعات پروفایل",
        status: error.response?.status,
      };
    }
  }
};
//#endregion

//#region AdminPropertyTypes
// Get a specific property type by ID
export const getAdminPropertyType = async (id: string): Promise<any> => {
  try {
    console.log(`🔍 Fetching property type details for ID: ${id}`);

    // Get token from localStorage if in browser environment
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("accessToken") || "";
    }

    // Create headers with authentication token
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Make the API request
    const response = await api.get(
      `/admin/property-type/get-property-type/${id}`,
      {
        headers,
      }
    );

    console.log(`🔍 Property type details response status: ${response.status}`);

    return {
      success: true,
      data: response.data.data || response.data,
      message:
        response.data.message || "اطلاعات نوع کاربری با موفقیت دریافت شد",
      status: response.status,
    };
  } catch (error: any) {
    console.error(
      `❌ Error fetching property type details for ID ${id}:`,
      error
    );

    // Log additional error details
    if (error.response) {
      console.error("Error response status: ", error.response.status);
      console.error("Error response data: ", error.response.data);
    }

    // Try direct axios fallback
    try {
      console.log(
        "⚙️ Attempting direct Axios fallback for property type details..."
      );

      // Get token from localStorage if in browser environment
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("accessToken") || "";
      }

      // Create headers with authentication token
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/property-type/get-property-type/${id}`,
        { headers }
      );

      return {
        success: true,
        data: directResponse.data.data || directResponse.data,
        message:
          directResponse.data.message ||
          "اطلاعات نوع کاربری با موفقیت دریافت شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);

      // Return structured error response
      return {
        success: false,
        message:
          error.response?.data?.message || "خطا در دریافت اطلاعات نوع کاربری",
        status: error.response?.status,
      };
    }
  }
};

export const getAdminPropertyTypes = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  // Ensure limit is not greater than 100 (backend restriction)
  const { page = 1, limit: requestedLimit = 10, forceRefresh = false } = params;
  const limit = Math.min(requestedLimit, 100);

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    console.log(
      `🔍 Fetching property types (force refresh: ${forceRefresh}, limit: ${limit})...`
    );
    const response = await api.get(
      `/admin/property-type/get-property-types?page=${page}&limit=${limit}${cacheParam}`
    );

    console.log("🔍 Property types API response status:", response.status);

    // If successful, log the response data
    if (response.status === 200) {
      console.log("🔍 Property types API response data:", response.data);
    }

    // Handle the specific response structure we've confirmed
    if (response.data?.success && response.data?.data?.data) {
      console.log(`🔍 Found ${response.data.data.data.length} property types`);
      return response.data.data.data;
    }

    // Handle other potential response structures as fallback
    let data = [];
    if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    } else if (Array.isArray(response.data)) {
      data = response.data;
    }

    return data || [];
  } catch (err) {
    console.error("❌ Error fetching property types:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for property types...");

      // Get token from localStorage if in browser environment
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("accessToken") || "";
      }

      // Create headers with authentication token
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["x-access-token"] = token;
      }

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/property-type/get-property-types?page=${page}&limit=${limit}${cacheParam}`,
        {
          headers,
          withCredentials: false,
        }
      );

      // Handle the specific response structure we've confirmed
      if (directResponse.data?.success && directResponse.data?.data?.data) {
        console.log(
          `⚙️ Found ${directResponse.data.data.data.length} property types in direct response`
        );
        return directResponse.data.data.data;
      }

      // Handle other potential response structures as fallback
      let directData = [];
      if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      }

      return directData || [];
    } catch (fallbackErr) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return [];
    }
  }
};

export const createAdminPropertyType = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/property-type/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "نوع کاربری با موفقیت ایجاد شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error("Error creating property type:", err);
    return {
      success: false,
      message:
        err.response?.data?.message || "ایجاد نوع کاربری با خطا مواجه شد",
    };
  }
};

export const updateAdminPropertyType = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/property-type/update/${id}`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "نوع کاربری با موفقیت به‌روزرسانی شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error(`Error updating property type ${id}:`, err);
    return {
      success: false,
      message:
        err.response?.data?.message || "به‌روزرسانی نوع کاربری با خطا مواجه شد",
    };
  }
};

export const deleteAdminPropertyType = async (
  id: string
): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/admin/property-type/delete/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "نوع کاربری با موفقیت حذف شد",
    };
  } catch (err: any) {
    console.error(`Error deleting property type ${id}:`, err);
    return {
      success: false,
      message: err.response?.data?.message || "حذف نوع کاربری با خطا مواجه شد",
    };
  }
};

//#endregion

//#region AdminCategories
export const getAdminCategories = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  const { page = 1, limit = 10, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    console.log(`🔍 Fetching categories (force refresh: ${forceRefresh})...`);
    const response = await api.get(
      `/admin/category/get-categories?page=${page}&limit=${limit}${cacheParam}`
    );

    console.log("🔍 Categories API response status:", response.status);

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
      console.log(
        `🔍 Found ${data.length} categories in response.data.data.data`
      );
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
      console.log(`🔍 Found ${data.length} categories in response.data.data`);
    } else if (Array.isArray(response.data)) {
      data = response.data;
      console.log(
        `🔍 Found ${data.length} categories in response.data (array)`
      );
    } else {
      console.warn(
        "⚠️ Unexpected categories response structure:",
        response.data
      );
    }

    // Log sample data to check for isDeleted property
    if (data.length > 0) {
      console.log("🔍 Sample category:", JSON.stringify(data[0], null, 2));
      const deletedCategories = data.filter(
        (cat: any) => cat.isDeleted === true
      );
      console.log(
        `🔍 Found ${deletedCategories.length} deleted categories out of ${data.length}`
      );
      if (deletedCategories.length > 0) {
        console.log(
          "🔍 First deleted category:",
          JSON.stringify(deletedCategories[0], null, 2)
        );
      }
    }

    return data || [];
  } catch (err) {
    console.error("❌ Error fetching categories:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for categories...");
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/category/get-categories?page=${page}&limit=${limit}${cacheParam}`,
        {
          withCredentials: false,
        }
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data?.data &&
        Array.isArray(directResponse.data.data.data)
      ) {
        directData = directResponse.data.data.data;
      } else if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      }
      return directData || [];
    } catch (fallbackErr) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return [];
    }
  }
};

// Get a specific category by ID
export const getAdminCategoryById = async (id: string): Promise<any> => {
  try {
    console.log(`🔍 Fetching category details for ID: ${id}`);

    // Get token from localStorage if in browser environment
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("accessToken") || "";
    }

    // Create headers with authentication token
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`🔍 Using authentication token: ${token ? "Yes" : "No"}`);

    // Make the API request
    const response = await api.get(`/admin/category/get-category/${id}`, {
      headers,
    });

    console.log(`🔍 Category details response status: ${response.status}`);
    console.log(`🔍 Category details data:`, response.data);

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "اطلاعات دسته‌بندی با موفقیت دریافت شد",
      status: response.status,
    };
  } catch (err: any) {
    console.error(`❌ Error fetching category details for ID ${id}:`, err);

    // Log additional error details
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    }

    // Try direct axios fallback
    try {
      console.log(
        "⚙️ Attempting direct Axios fallback for category details..."
      );

      // Get token from localStorage if in browser environment
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("accessToken") || "";
      }

      // Create headers with authentication token
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/category/get-category/${id}`,
        { headers }
      );

      console.log(
        `⚙️ Direct fallback response status: ${directResponse.status}`
      );
      console.log(`⚙️ Direct fallback data:`, directResponse.data);

      return {
        success: true,
        data: directResponse.data.data || directResponse.data,
        message:
          directResponse.data.message ||
          "اطلاعات دسته‌بندی با موفقیت دریافت شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);

      // Return structured error response
      return {
        success: false,
        message:
          err.response?.data?.message || "خطا در دریافت اطلاعات دسته‌بندی",
        status: err.response?.status,
      };
    }
  }
};

export const createAdminCategory = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/category/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "دسته‌بندی با موفقیت ایجاد شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error("Error creating category:", err);
    return {
      success: false,
      message: err.response?.data?.message || "ایجاد دسته‌بندی با خطا مواجه شد",
    };
  }
};

export const updateAdminCategory = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/category/update/${id}`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "دسته‌بندی با موفقیت به‌روزرسانی شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error(`Error updating category ${id}:`, err);
    return {
      success: false,
      message:
        err.response?.data?.message || "به‌روزرسانی دسته‌بندی با خطا مواجه شد",
    };
  }
};

export const deleteAdminCategory = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/admin/category/delete/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "دسته‌بندی با موفقیت حذف شد",
    };
  } catch (err: any) {
    console.error(`Error deleting category ${id}:`, err);
    return {
      success: false,
      message: err.response?.data?.message || "حذف دسته‌بندی با خطا مواجه شد",
    };
  }
};

export const restoreAdminCategory = async (
  id: string
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/category/restore/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "دسته‌بندی با موفقیت بازیابی شد",
    };
  } catch (err: any) {
    console.error(`Error restoring category ${id}:`, err);
    return {
      success: false,
      message:
        err.response?.data?.message || "بازیابی دسته‌بندی با خطا مواجه شد",
    };
  }
};
//#endregion

//#region AdminFilters
export const getAdminFilters = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  const { page = 1, limit = 10, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    console.log(`🔍 Fetching filters (force refresh: ${forceRefresh})...`);
    const response = await api.get(
      `/admin/filter/filters?page=${page}&limit=${limit}${cacheParam}`
    );

    console.log("🔍 Filters API response status:", response.status);

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
      console.log(`🔍 Found ${data.length} filters in response.data.data.data`);
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
      console.log(`🔍 Found ${data.length} filters in response.data.data`);
    } else if (Array.isArray(response.data)) {
      data = response.data;
      console.log(`🔍 Found ${data.length} filters in response.data (array)`);
    } else {
      console.warn("⚠️ Unexpected filters response structure:", response.data);
    }

    // Log sample data to check for isDeleted property
    if (data.length > 0) {
      console.log("🔍 Sample filter:", JSON.stringify(data[0], null, 2));
      const deletedFilters = data.filter(
        (filter: any) => filter.isDeleted === true
      );
      console.log(
        `🔍 Found ${deletedFilters.length} deleted filters out of ${data.length}`
      );
      if (deletedFilters.length > 0) {
        console.log(
          "🔍 First deleted filter:",
          JSON.stringify(deletedFilters[0], null, 2)
        );
      }
    }

    return data || [];
  } catch (err) {
    console.error("❌ Error fetching filters:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for filters...");
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/filter/filters?page=${page}&limit=${limit}${cacheParam}`,
        {
          withCredentials: false,
        }
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data?.data &&
        Array.isArray(directResponse.data.data.data)
      ) {
        directData = directResponse.data.data.data;
      } else if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        directData = directResponse.data.data;
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
      }
      return directData || [];
    } catch (fallbackErr) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return [];
    }
  }
};

// Get a specific filter by ID
export const getAdminFilterById = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Fetching filter details for ID: ${id}`);

    // Get token from localStorage if in browser environment
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Make the API request
    const response = await api.get(`/admin/filter/filter/${id}`, { headers });

    console.log(`🔍 Filter details response status: ${response.status}`);
    console.log(`🔍 Filter details data:`, response.data);

    return {
      success: response.data.success,
      data: response.data.data || response.data,
      message: response.data.message || "اطلاعات فیلتر با موفقیت دریافت شد",
      status: response.status,
    };
  } catch (error: any) {
    console.error(`❌ Error fetching filter details for ID ${id}:`, error);

    // Log additional error details
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Try direct axios fallback
    try {
      console.log("⚙️ Attempting direct Axios fallback for filter details...");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/filter/filter/${id}`,
        { headers }
      );

      console.log(
        `⚙️ Direct fallback response status: ${directResponse.status}`
      );
      console.log(`⚙️ Direct fallback data:`, directResponse.data);

      return {
        success: directResponse.data.success,
        data: directResponse.data.data || directResponse.data,
        message:
          directResponse.data.message || "اطلاعات فیلتر با موفقیت دریافت شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);

      // Return structured error response
      return {
        success: false,
        message: error.response?.data?.message || "خطا در دریافت اطلاعات فیلتر",
        status: error.response?.status,
      };
    }
  }
};

export const createAdminFilter = async (
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Creating filter with data:`, JSON.stringify(data, null, 2));

    // Transform the data to match the backend expected structure
    const transformedData = {
      categories: data.categories || [],
      adSellType: data.adSellType || "both",
      name: data.name,
      enName: data.enName,
      adInputType: data.adInputType,
      userFilterType: data.userFilterType,
      options: data.options || [], // This will now be key-value pairs
      isRequired: data.isRequired || false,
      isMain: data.isMain || false,
      row: data.row || 0,
      multiSelectable: data.multiSelectable || false,
    };

    console.log(
      `🔍 Transformed data for backend:`,
      JSON.stringify(transformedData, null, 2)
    );

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.post(`/admin/filter/create`, transformedData, {
      headers,
    });

    console.log(`✅ Create filter response status: ${response.status}`);
    console.log(`✅ Create filter response data:`, response.data);

    return {
      success: response.data.success,
      message: response.data?.message || "فیلتر با موفقیت ایجاد شد",
      data: response.data?.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error("❌ Error creating filter:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for filter creation...");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      // Transform the data for fallback as well
      const transformedData = {
        categories: data.categories || [],
        adSellType: data.adSellType || "both",
        name: data.name,
        enName: data.enName,
        adInputType: data.adInputType,
        userFilterType: data.userFilterType,
        options: data.options || [],
        isRequired: data.isRequired || false,
        isMain: data.isMain || false,
        multiSelectable: data.multiSelectable || false,
        row: data.row || 0,
      };

      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/filter/create`,
        transformedData,
        { headers }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "فیلتر با موفقیت ایجاد شد",
        data: directResponse.data?.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error(
        "❌ Direct filter creation fallback also failed:",
        fallbackErr
      );

      return {
        success: false,
        message: error.response?.data?.message || "ایجاد فیلتر با خطا مواجه شد",
        status: error.response?.status,
      };
    }
  }
};

export const updateAdminFilter = async (
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    console.log(
      `🔍 Updating filter ID: ${id} with data:`,
      JSON.stringify(data, null, 2)
    );

    // Transform the data to match the backend expected structure
    const transformedData = {
      categories: data.categories || [],
      adSellType: data.adSellType || "both",
      name: data.name,
      enName: data.enName,
      adInputType: data.adInputType,
      userFilterType: data.userFilterType,
      options: data.options || [], // This will now be key-value pairs
      isRequired: data.isRequired || false,
      isMain: data.isMain || false,
      row: data.row || 0,
      multiSelectable: data.multiSelectable || false,
    };

    console.log(
      `🔍 Transformed data for backend:`,
      JSON.stringify(transformedData, null, 2)
    );

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.put(
      `/admin/filter/update/${id}`,
      transformedData,
      {
        headers,
      }
    );

    console.log(`✅ Update filter response status: ${response.status}`);
    console.log(`✅ Update filter response data:`, response.data);

    return {
      success: response.data.success,
      message: response.data?.message || "فیلتر با موفقیت به‌روزرسانی شد",
      data: response.data?.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error(`❌ Error updating filter ${id}:`, error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(`⚙️ Attempting direct Axios fallback for filter update...`);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      // Transform the data for fallback as well
      const transformedData = {
        categories: data.categories || [],
        adSellType: data.adSellType || "both",
        name: data.name,
        enName: data.enName,
        adInputType: data.adInputType,
        userFilterType: data.userFilterType,
        options: data.options || [],
        isRequired: data.isRequired || false,
        isMain: data.isMain || false,
        row: data.row || 0,
        multiSelectable: data.multiSelectable || false,
      };

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/filter/update/${id}`,
        transformedData,
        { headers }
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "فیلتر با موفقیت به‌روزرسانی شد",
        data: directResponse.data?.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error(
        "❌ Direct filter update fallback also failed:",
        fallbackErr
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "به‌روزرسانی فیلتر با خطا مواجه شد",
        status: error.response?.status,
      };
    }
  }
};

export const deleteAdminFilter = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🗑️ Deleting filter with ID: ${id}`);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.delete(`/admin/filter/delete/${id}`, {
      headers,
    });

    console.log(`✅ Delete filter response status: ${response.status}`);
    console.log(`✅ Delete filter response data:`, response.data);

    return {
      success: response.data.success,
      message: response.data?.message || "فیلتر با موفقیت حذف شد",
      data: response.data?.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error(`❌ Error deleting filter ${id}:`, error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(`⚙️ Attempting direct Axios fallback for filter deletion...`);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/admin/filter/delete/${id}`,
        { headers }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "فیلتر با موفقیت حذف شد",
        data: directResponse.data?.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error(
        "❌ Direct filter deletion fallback also failed:",
        fallbackErr
      );

      return {
        success: false,
        message: error.response?.data?.message || "حذف فیلتر با خطا مواجه شد",
        status: error.response?.status,
      };
    }
  }
};

export const restoreAdminFilter = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🔄 Restoring filter with ID: ${id}`);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.put(
      `/admin/filter/restore/${id}`,
      {},
      { headers }
    );

    console.log(`✅ Restore filter response status: ${response.status}`);
    console.log(`✅ Restore filter response data:`, response.data);

    return {
      success: response.data.success,
      message: response.data?.message || "فیلتر با موفقیت بازیابی شد",
      data: response.data?.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error(`❌ Error restoring filter ${id}:`, error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log(
        `⚙️ Attempting direct Axios fallback for filter restoration...`
      );

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/filter/restore/${id}`,
        {},
        { headers }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "فیلتر با موفقیت بازیابی شد",
        data: directResponse.data?.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error(
        "❌ Direct filter restoration fallback also failed:",
        fallbackErr
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "بازیابی فیلتر با خطا مواجه شد",
        status: error.response?.status,
      };
    }
  }
};

// Plan types
export type PlanType = "free" | "premium" | "business" | "enterprise";

// Plan list item type

// Create plan payload
// API functions
export async function getPlans(showDeleted?: boolean): Promise<PlanListItem[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = {};
  if (token) headers["x-access-token"] = token;

  let url = `${mainConfig.apiServer}/admin/plan/get`;
  if (typeof showDeleted === "boolean") {
    url += `?isDeleted=${showDeleted}`;
  }

  const res = await axios.get(url, {
    headers,
  });
  return res.data.data;
}

export async function createPlan(payload: CreatePlanPayload) {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const res = await api.post(
      `${mainConfig.apiServer}/admin/plan/create`,
      payload,
      { headers }
    );
    return {
      success: res.data.success,
      message: res.data?.message || "پلن با موفقیت ایجاد شد",
      data: res.data?.data,
      status: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || " ایجاد پلن با خطا مواجه شد",
      status: error.response?.status,
    };
  }
}

export async function updatePlan(id: string, payload: UpdatePlanPayload) {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const res = await api.put(
      `${mainConfig.apiServer}/admin/plan/update/${id}`,
      payload,
      { headers }
    );
    return {
      success: res.data.success,
      message: res.data?.message || "پلن با موفقیت ویرایش شد",
      data: res.data?.data,
      status: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || " ویرایش پلن با خطا مواجه شد",
      status: error.response?.status,
    };
  }
}

export async function deletePlan(id: string) {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const res = await api.delete(
      `${mainConfig.apiServer}/admin/plan/delete/${id}`,
      {
        headers,
      }
    );
    return {
      success: res.data.success,
      message: res.data?.message || "پلن با موفقیت حدف شد",
      data: res.data?.data,
      status: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || " حذف پلن با خطا مواجه شد",
      status: error.response?.status,
    };
  }
}

export async function restorePlan(id: string) {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const res = await axios.put(
      `${mainConfig.apiServer}/admin/plan/restore/${id}`,
      {},
      { headers }
    );
    return {
      success: res.data.success,
      message: res.data?.message || "پلن با موفقیت حدف شد",
      data: res.data?.data,
      status: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || " حذف پلن با خطا مواجه شد",
      status: error.response?.status,
    };
  }
}

// Create agency
export const createAgency = async (agencyData: {
  name: string;
  phone: string;
  description: string;
  agencyOwnerId: string;
  address: {
    province: string;
    city: string;
    area: string;
    location: {
      coordinates: [number, number];
    };
    fullAddress: string;
  };
  isPhoneShow: boolean;
  isAddressShow: boolean;
  logoFileName: string;
}): Promise<ApiResponse> => {
  try {
    console.log(`🏢 Creating new agency:`, agencyData);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.post(`/admin/agency/create-agency`, agencyData, {
      headers,
    });

    console.log(`✅ Create agency response status: ${response.status}`);
    console.log(`✅ Create agency response data:`, response.data);

    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "آژانس با موفقیت ایجاد شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error creating agency:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در ایجاد آژانس",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return returnError(error);
  }
};

// File Upload Functions

// Step 1: Get upload URL
export const getUploadUrl = async (
  entityType: string,
  fileType: string,
  extension: string
): Promise<ApiResponse> => {
  try {
    console.log(
      `📤 Getting upload URL for ${entityType} with extension ${extension}`
    );

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(
      `/api/upload/get-upload-url?entityType=${entityType}&fileType=${fileType}&extension=${extension}`,
      { headers }
    );

    console.log(`✅ Upload URL response:`, response.data);

    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data.data,
      message: response.data.message || "آدرس آپلود دریافت شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error getting upload URL:", error);
    return returnError(error);
  }
};

// Step 2: Upload file to signed URL
export const uploadFileToSignedUrl = async (
  signedUrl: string,
  file: File
): Promise<ApiResponse> => {
  try {
    console.log(`📤 Uploading file to signed URL:`, signedUrl);

    const response = await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    console.log(`✅ File upload response status:`, response.status);

    return {
      success: response.status === 200,
      message: "فایل با موفقیت آپلود شد",
      status: response.status,
    };
  } catch (error: any) {
    console.error("❌ Error uploading file:", error);
    return returnError(error);
  }
};

// Step 3: Complete upload
export const completeUpload = async (
  fileName: string,
  fileType: string,
  entityType: string,
  originalName: string
): Promise<ApiResponse> => {
  try {
    console.log(`📤 Completing upload for file:`, fileName);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const requestBody = {
      fileName,
      fileType,
      entityType,
      originalName,
    };

    const response = await api.post(
      `/api/upload/complete-upload`,
      requestBody,
      {
        headers,
      }
    );

    console.log(`✅ Complete upload response:`, response.data);

    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data.data,
      message: response.data.message || "فایل با موفقیت آپلود شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error completing upload:", error);
    return returnError(error);
  }
};

// Update agency
export const updateAgency = async (
  id: string,
  agencyData: {
    name: string;
    phone: string;
    description: string;
    address: {
      province: string;
      city: string;
      area: string;
      location: {
        coordinates: [number, number];
      };
      fullAddress: string;
    };
  }
): Promise<ApiResponse> => {
  try {
    console.log(`🏢 Updating agency with ID: ${id}`, agencyData);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.put(
      `/admin/agency/update-agency/${id}`,
      agencyData,
      {
        headers,
      }
    );

    console.log(`✅ Update agency response status: ${response.status}`);
    console.log(`✅ Update agency response data:`, response.data);

    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "آژانس با موفقیت به‌روزرسانی شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error updating agency:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در به‌روزرسانی آژانس",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return returnError(error);
  }
};

// Delete agency
export const deleteAgency = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🗑️ Deleting agency with ID: ${id}`);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.delete(`/admin/agency/delete-agency/${id}`, {
      headers,
    });

    console.log(`✅ Delete agency response status: ${response.status}`);
    console.log(`✅ Delete agency response data:`, response.data);

    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "آژانس با موفقیت حذف شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error deleting agency:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در حذف آژانس",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return returnError(error);
  }
};

// End user session
export const endUserSession = async (
  sessionId: string,
  endAllSessions: boolean = false
): Promise<ApiResponse> => {
  try {
    console.log(
      `🔚 Ending session with ID: ${sessionId}, endAll: ${endAllSessions}`
    );

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Format the request body
    const requestBody = {
      sessionId,
      endAllSessions,
    };

    const response = await api.post(`/api/auth/end-session`, requestBody, {
      headers,
    });

    console.log(`✅ End session response status: ${response.status}`);
    console.log(`✅ End session response data:`, response.data);

    // Return the exact response from the API
    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "جلسه با موفقیت پایان یافت",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error ending session:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در پایان دادن جلسه",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return returnError(error);
  }
};

//#region AdminAds
// Get admin ads with filtering and pagination
export const getAdminAds = async (
  params: {
    propertyType?: string;
    category?: string;
    status?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: number;
    forceRefresh?: boolean;
  } = {}
): Promise<ApiResponse> => {
  const {
    propertyType,
    category,
    status,
    isActive,
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = -1,
    forceRefresh = false,
  } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  // Build query parameters
  let queryParams = `page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`;

  // Add filter parameters if they exist
  if (propertyType)
    queryParams += `&propertyType=${encodeURIComponent(propertyType)}`;
  if (category) queryParams += `&category=${encodeURIComponent(category)}`;
  if (status) queryParams += `&status=${encodeURIComponent(status)}`;
  if (isActive !== undefined) queryParams += `&isActive=${isActive}`;

  try {
    console.log(`📢 Fetching ads with filters...`);
    const apiUrl = `/admin/ad/get-ads?${queryParams}${cacheParam}`;
    console.log(`📢 API URL: ${apiUrl}`);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.get(apiUrl, { headers });

    console.log("📢 Ads API response status:", response.status);
    console.log("📢 Ads API response data:", response.data);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (err: any) {
    console.error("📢 Error fetching ads:", err);
    if (err.response) {
      console.error("📢 Error response status:", err.response.status);
      console.error("📢 Error response data:", err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for ads...");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/ad/get-ads?${queryParams}${cacheParam}`,
        {
          headers,
          withCredentials: false,
        }
      );

      console.log("⚙️ Direct ads request status:", directResponse.status);
      console.log("⚙️ Direct ads request data:", directResponse.data);

      return {
        success: true,
        data: directResponse.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return {
        success: false,
        message: err.message || "Failed to fetch ads",
        status: err.response?.status || 500,
      };
    }
  }
};

// Get ad details by ID
export const getAdminAdById = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`📢 Fetching ad details for ID: ${id}`);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Make the API request
    const response = await api.get(`/admin/ad/get-ad/${id}`, { headers });

    console.log("📢 Ad details API response status:", response.status);
    console.log("📢 Ad details API response data:", response.data);

    // Process the response data to ensure it follows the expected structure
    let adData;

    // Check if response has a nested data structure and extract accordingly
    if (response.data && response.data.data) {
      adData = response.data.data;
      console.log("📢 Found nested data structure, using response.data.data");
    } else {
      adData = response.data;
      console.log("📢 Using direct response data");
    }

    // Make sure we have all required fields for display
    const processedData = {
      success: true,
      data: adData,
      message: response.data.message || "آگهی با موفقیت دریافت شد",
      status: response.status,
    };

    console.log("📢 Processed ad data ready for component:", processedData);
    return processedData;
  } catch (err: any) {
    console.error("📢 Error fetching ad details:", err);

    // Add detailed error logging
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for ad details...");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/ad/get-ad/${id}`,
        {
          headers,
          withCredentials: false,
        }
      );

      console.log(
        "⚙️ Direct ad details request status:",
        directResponse.status
      );
      console.log("⚙️ Direct ad details request data:", directResponse.data);

      // Process the data from the direct response
      let directAdData;

      // Check if direct response has a nested data structure
      if (directResponse.data && directResponse.data.data) {
        directAdData = directResponse.data.data;
      } else {
        directAdData = directResponse.data;
      }

      return {
        success: true,
        data: directAdData,
        message: directResponse.data.message || "آگهی با موفقیت دریافت شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return {
        success: false,
        message: err.message || "خطا در دریافت اطلاعات آگهی",
        status: err.response?.status || 500,
      };
    }
  }
};

// Update ad
export const updateAdminAd = async (
  id: string,
  adData: {
    title: string;
    description: string;
    propertyType?: string;
    category?: string;
    saleOrRent: "sale" | "rent";
    address: {
      province: string;
      city: string;
      area: string;
      location: {
        coordinates: [number, number];
      };
      fullAddress: string;
    };
    filters?: Record<string, any>;
    price: number;
    flags?: string[];
    agency?: string;
    mainImageId?: string;
    mediaIds?: string;
  }
): Promise<ApiResponse> => {
  try {
    console.log(`📢 Updating ad with ID: ${id}`, adData);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    const response = await api.put(`/ad/update-ad/${id}`, adData, {
      headers,
    });

    console.log(`✅ Update ad response status: ${response.status}`);
    console.log(`✅ Update ad response data:`, response.data);

    return {
      success:
        response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "آگهی با موفقیت به‌روزرسانی شد",
      status: response.data.status || response.status,
    };
  } catch (error: any) {
    console.error("❌ Error updating ad:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      // Check for 401 unauthorized and handle redirect
      if (error.response.status === 401) {
        handle401Redirect();
      }

      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success:
            error.response.data.success !== undefined
              ? error.response.data.success
              : false,
          message: error.response.data.message || "خطا در به‌روزرسانی آگهی",
          status: error.response.data.status || error.response.status,
          data: error.response.data,
        };
      }
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return returnError(error);
  }
};
//#endregion

// Confirm or reject an agency
export const confirmAgency = async (
  agencyId: string,
  isConfirmed: boolean,
  message?: string
): Promise<ApiResponse> => {
  try {
    console.log(
      `🏢 ${
        isConfirmed ? "Confirming" : "Rejecting"
      } agency with ID: ${agencyId}`
    );

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Prepare request body
    const requestBody: Record<string, any> = {
      agencyId,
      isConfirmed,
      message:
        message ||
        (isConfirmed ? "آژانس شما توسط ادمین تایید شد." : "آژانس شما رد شد."),
    };

    console.log("🏢 Request body:", requestBody);

    // Make the API request
    const response = await api.put(
      `/admin/agency/confirm-agency`,
      requestBody,
      {
        headers,
      }
    );

    console.log(`🏢 Confirm agency response status: ${response.status}`);
    console.log(`🏢 Confirm agency response data:`, response.data);

    return {
      success: response.data.success || true,
      data: response.data,
      message: isConfirmed
        ? response.data.message || "آژانس با موفقیت تایید شد"
        : response.data.message || "آژانس با موفقیت رد شد",
      status: response.status,
    };
  } catch (err: any) {
    console.error(
      `🏢 Error ${isConfirmed ? "confirming" : "rejecting"} agency:`,
      err
    );

    // Add detailed error logging
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback...");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      // Prepare request body for fallback
      const requestBody: Record<string, any> = {
        agencyId,
        isConfirmed,
        message:
          message ||
          (isConfirmed ? "آژانس شما توسط ادمین تایید شد." : "آژانس شما رد شد."),
      };

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/agency/confirm-agency`,
        requestBody,
        {
          headers,
          withCredentials: false,
        }
      );

      console.log(
        `⚙️ Direct confirm agency response status:`,
        directResponse.status
      );
      console.log(
        `⚙️ Direct confirm agency response data:`,
        directResponse.data
      );

      return {
        success: directResponse.data.success || true,
        data: directResponse.data,
        message: isConfirmed
          ? directResponse.data.message || "آژانس با موفقیت تایید شد"
          : directResponse.data.message || "آژانس با موفقیت رد شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return {
        success: false,
        message:
          err.message ||
          (isConfirmed ? "خطا در تایید آژانس" : "خطا در رد آژانس"),
        status: err.response?.status || 500,
      };
    }
  }
};

// Confirm or reject an ad
export const confirmAd = async (
  adId: string,
  isConfirmed: boolean,
  rejectReason?: string
): Promise<ApiResponse> => {
  try {
    console.log(
      `📢 ${isConfirmed ? "Confirming" : "Rejecting"} ad with ID: ${adId}`
    );

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Prepare request body
    const requestBody: Record<string, any> = {
      adId,
      isConfirmed,
    };

    // Add reject reason if ad is being rejected
    if (!isConfirmed && rejectReason) {
      requestBody.rejectReason = rejectReason;
    }

    console.log("📢 Request body:", requestBody);

    // Make the API request
    const response = await api.put(`/admin/ad/confirm-ad`, requestBody, {
      headers,
    });

    console.log(`📢 Confirm ad response status: ${response.status}`);
    console.log(`📢 Confirm ad response data:`, response.data);

    return {
      success: response.data.success || true,
      data: response.data,
      message: isConfirmed
        ? response.data.message || "آگهی با موفقیت تایید شد"
        : response.data.message || "آگهی با موفقیت رد شد",
      status: response.status,
    };
  } catch (err: any) {
    console.error(
      `📢 Error ${isConfirmed ? "confirming" : "rejecting"} ad:`,
      err
    );

    // Add detailed error logging
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback...");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      // Prepare request body for fallback
      const requestBody: Record<string, any> = {
        adId,
        isConfirmed,
      };

      // Add reject reason if ad is being rejected
      if (!isConfirmed && rejectReason) {
        requestBody.rejectReason = rejectReason;
      }

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/ad/confirm-ad`,
        requestBody,
        {
          headers,
          withCredentials: false,
        }
      );

      console.log(
        `⚙️ Direct confirm ad response status:`,
        directResponse.status
      );
      console.log(`⚙️ Direct confirm ad response data:`, directResponse.data);

      return {
        success: directResponse.data.success || true,
        data: directResponse.data,
        message: isConfirmed
          ? directResponse.data.message || "آگهی با موفقیت تایید شد"
          : directResponse.data.message || "آگهی با موفقیت رد شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return {
        success: false,
        message:
          err.message || (isConfirmed ? "خطا در تایید آگهی" : "خطا در رد آگهی"),
        status: err.response?.status || 500,
      };
    }
  }
};

// Delete ad by ID
export const deleteAd = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`📢 Deleting ad with ID: ${id}`);

    // Get token from localStorage if in browser
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = {};
    if (token) headers["x-access-token"] = token;

    // Make the API request
    const response = await api.delete(`/ad/delete-ad/${id}`, { headers });

    console.log(`📢 Delete ad response status: ${response.status}`);
    console.log(`📢 Delete ad response data:`, response.data);

    return {
      success: response.data.success || true,
      data: response.data,
      message: response.data.message || "آگهی با موفقیت حذف شد",
      status: response.status,
    };
  } catch (err: any) {
    console.error(`📢 Error deleting ad:`, err);

    // Add detailed error logging
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    }

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback...");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-access-token"] = token;

      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/ad/delete-ad/${id}`,
        {
          headers,
          withCredentials: false,
        }
      );

      console.log(
        `⚙️ Direct delete ad response status:`,
        directResponse.status
      );
      console.log(`⚙️ Direct delete ad response data:`, directResponse.data);

      return {
        success: directResponse.data.success || true,
        data: directResponse.data,
        message: directResponse.data.message || "آگهی با موفقیت حذف شد",
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return {
        success: false,
        message: err.message || "خطا در حذف آگهی",
        status: err.response?.status || 500,
      };
    }
  }
};
