import mainConfig from "@/configs/mainConfig";
import axios from "axios";

// Create a reusable axios instance with base URL and default config
const api = axios.create({
  baseURL: mainConfig.apiServer,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['x-access-token'] = token;
      }
    }
    return config;
  },
  (error) => {
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

// Get Agency Members
export const getAgencyMembers = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Fetching agency members for ID: ${id}`);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;

    const response = await api.get(`/admin/agency/get-members/${id}`, { headers });
    console.log(`✅ Agency members response:`, response.data);
    
    return { 
      success: true,
      data: response.data,
      status: response.status 
    };
  } catch (error: any) {
    console.error(`❌ Error fetching agency members for ID ${id}:`, error);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }
    return returnError(error);
  }
};

// Add area admin to an agency
export const addAgencyAreaAdmin = async (
  agencyId: string,
  phone: string
): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Adding area admin to agency ID: ${agencyId} with phone: ${phone}`);
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    // Format the request body
    const requestBody = {
      agencyId,
      countryCode: "98",
      phone,
      message: "Agency has been verified and confirmed"
    };
    
    const response = await api.post(
      `/admin/agency/add-area_admin`,
      requestBody,
      { headers }
    );
    
    console.log(`✅ Add area admin response status: ${response.status}`);
    console.log(`✅ Add area admin response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مدیر منطقه با موفقیت اضافه شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error adding area admin:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در افزودن مدیر منطقه",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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

// Remove area admin from an agency
export const removeAgencyAreaAdmin = async (
  agencyId: string,
  adminId: string
): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Removing area admin with ID: ${adminId} from agency ID: ${agencyId}`);
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    // Format the request body
    const requestBody = {
      agencyId,
      adminId
    };
    
    const response = await api.delete(
      `/admin/agency/remove-area_admin`,
      { 
        headers,
        data: requestBody  // For DELETE requests, the body goes in the 'data' property
      }
    );
    
    console.log(`✅ Remove area admin response status: ${response.status}`);
    console.log(`✅ Remove area admin response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مدیر منطقه با موفقیت حذف شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error removing area admin:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در حذف مدیر منطقه",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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

// Add consultant to an agency
export const addAgencyConsultant = async (
  agencyId: string,
  phone: string
): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Adding consultant to agency ID: ${agencyId} with phone: ${phone}`);
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    // Format the request body
    const requestBody = {
      agencyId,
      countryCode: "98",
      phone,
      message: "Agency has been verified and confirmed"
    };
    
    const response = await api.post(
      `/admin/agency/add-consultant`,
      requestBody,
      { headers }
    );
    
    console.log(`✅ Add consultant response status: ${response.status}`);
    console.log(`✅ Add consultant response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مشاور با موفقیت اضافه شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error adding consultant:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در افزودن مشاور",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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

// Remove consultant from an agency
export const removeAgencyConsultant = async (
  agencyId: string,
  consultantId: string
): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Removing consultant with ID: ${consultantId} from agency ID: ${agencyId}`);
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    // Format the request body
    const requestBody = {
      agencyId,
      consultantId
    };
    
    const response = await api.delete(
      `/admin/agency/remove-consultant`,
      { 
        headers,
        data: requestBody  // For DELETE requests, the body goes in the 'data' property
      }
    );
    
    console.log(`✅ Remove consultant response status: ${response.status}`);
    console.log(`✅ Remove consultant response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "مشاور با موفقیت حذف شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error removing consultant:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در حذف مشاور",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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

// Get agency verifications with pagination and status filtering
export const getAgencyVerifications = async (
  status: string = 'pending',
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Fetching agency verifications with status: ${status}, page: ${page}, limit: ${limit}`);
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    const response = await api.get(
      `/admin/agency/verifications?status=${status}&page=${page}&limit=${limit}`,
      { headers }
    );
    
    console.log(`✅ Get verifications response status: ${response.status}`);
    console.log(`✅ Get verifications response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "لیست تأییدیه‌ها با موفقیت دریافت شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error fetching verifications:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در دریافت لیست تأییدیه‌ها",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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

// Get agency verification documents
export const getAgencyVerificationDocuments = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Fetching verification documents for agency ID: ${id}`);
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    const response = await api.get(
      `/admin/agency/verification/documents/${id}`,
      { headers }
    );
    
    console.log(`✅ Get verification documents response status: ${response.status}`);
    console.log(`✅ Get verification documents response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "اطلاعات مدارک با موفقیت دریافت شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error fetching verification documents:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در دریافت اطلاعات مدارک",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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
  action: 'approve' | 'reject' | 'request_more_info' | 'review_document';
  documentIds: string | string[];
  rejectionReason?: string;
  documentNotes?: string;
}): Promise<ApiResponse> => {
  try {
    console.log(`🔍 Reviewing verification documents for agency ID: ${reviewData.agencyId}`);
    console.log(`🔍 Action: ${reviewData.action}`);
    
    // Format document IDs to array if it's a string
    const documentIds = Array.isArray(reviewData.documentIds) 
      ? reviewData.documentIds 
      : [reviewData.documentIds];
    
    // Get token from localStorage if in browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;
    
    // Prepare request body
    const requestBody = {
      agencyId: reviewData.agencyId,
      action: reviewData.action,
      documentIds: documentIds,
      rejectionReason: reviewData.rejectionReason || '',
      documentNotes: reviewData.documentNotes || ''
    };
    
    console.log(`🔍 Review request body:`, requestBody);
    
    const response = await api.post(
      `/admin/agency/verification/review`,
      requestBody,
      { headers }
    );
    
    console.log(`✅ Review documents response status: ${response.status}`);
    console.log(`✅ Review documents response data:`, response.data);

    // Return the exact response from the API
    return {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data,
      message: response.data.message || "بررسی مدارک با موفقیت انجام شد",
      status: response.data.status || response.status
    };
  } catch (error: any) {
    console.error("❌ Error reviewing verification documents:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      
      // If the error contains a response with a message, use that directly
      if (error.response.data) {
        return {
          success: error.response.data.success !== undefined ? error.response.data.success : false,
          message: error.response.data.message || "خطا در بررسی مدارک",
          status: error.response.data.status || error.response.status,
          data: error.response.data
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

// Helper function to handle API errors
const returnError = (error: any): ApiResponse => {
  if (error.response) {
    // The request was made and the server responded with a status code outside the 2xx range
    return {
      success: false,
      message: error.response.data?.message || 'An error occurred with the server response',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message: 'No response received from server',
      status: 0
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      success: false,
      message: error.message || 'An unknown error occurred',
      status: 500
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
    console.log(`🏢 Fetching agencies with filters...`);
    const apiUrl = `/admin/agency/get-all-agencies?${queryParams}${cacheParam}`;
    console.log(`🏢 API URL: ${apiUrl}`);

    const response = await api.get(apiUrl);

    console.log("🏢 Agencies API response status:", response.status);
    console.log("🏢 Agencies API response data:", response.data);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (err: any) {
    console.error("🏢 Error fetching agencies:", err);
    if (err.response) {
      console.error("🏢 Error response status:", err.response.status);
      console.error("🏢 Error response data:", err.response.data);
    }
    return {
      success: false,
      message: err.message || "Failed to fetch agencies",
      status: err.response?.status || 500,
    };
  }
};

// --- Country ---
export const getAdminCountries = async (
  params: {
    page?: number;
    limit?: number;
    forceRefresh?: boolean;
    includeDeleted?: boolean;
  } = {}
): Promise<any[]> => {
  const {
    page = 1,
    limit = 100,
    forceRefresh = false,
    includeDeleted = true,
  } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  // Add parameter to include deleted items
  const deletedParam = includeDeleted ? "&isDeleted=true" : "";

  try {
    console.log(
      `🔍 Fetching countries (force refresh: ${forceRefresh}, include deleted: ${includeDeleted})...`
    );
    // Don't add isDeleted param, we want all countries (deleted and non-deleted)
    const apiUrl = `/admin/country/get-countries?page=${page}&limit=${limit}${cacheParam}`;
    console.log(`🔍 API URL: ${apiUrl}`);

    const response = await api.get(apiUrl);

    console.log("🔍 Countries API response status:", response.status);

    // Log full response structure for debugging
    console.log(
      "🔍 Full API response structure:",
      JSON.stringify(
        {
          status: response.status,
          headers: response.headers,
          config: {
            url: response.config.url,
            method: response.config.method,
          },
        },
        null,
        2
      )
    );

    // Log the raw response data to check for deleted items
    console.log(
      "🔍 COUNTRIES API RESPONSE DATA:",
      JSON.stringify(response.data, null, 2)
    );

    // Specifically check for deleted items
    const deletedItems = Array.isArray(response.data)
      ? response.data.filter((item: any) => item.isDeleted)
      : Array.isArray(response.data?.data)
      ? response.data.data.filter((item: any) => item.isDeleted)
      : Array.isArray(response.data?.data?.data)
      ? response.data.data.data.filter((item: any) => item.isDeleted)
      : [];

    console.log(
      `🔍 FOUND ${deletedItems.length} DELETED ITEMS:`,
      JSON.stringify(deletedItems, null, 2)
    );

    // Log data summary
    const dataStructureSummary = {
      hasData: !!response.data,
      isDataObject: response.data && typeof response.data === "object",
      hasDataData: response.data?.data !== undefined,
      isDataDataObject:
        response.data?.data && typeof response.data.data === "object",
      hasDataDataData: response.data?.data?.data !== undefined,
      isDataDataDataArray:
        response.data?.data?.data && Array.isArray(response.data.data.data),
      dataDataDataLength:
        response.data?.data?.data && Array.isArray(response.data.data.data)
          ? response.data.data.data.length
          : "N/A",
      isDataArray: Array.isArray(response.data),
      dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
    };
    console.log("🔍 Data structure summary:", dataStructureSummary);

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      // Most likely structure
      data = response.data.data.data;
      console.log(
        `🔍 Found ${data.length} countries in response.data.data.data`
      );

      // Log first item to see structure
      if (data.length > 0) {
        console.log(
          "🔍 Sample country data:",
          JSON.stringify(data[0], null, 2)
        );
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      // Alternative structure
      data = response.data.data;
      console.log(`🔍 Found ${data.length} countries in response.data.data`);

      // Log first item to see structure
      if (data.length > 0) {
        console.log(
          "🔍 Sample country data:",
          JSON.stringify(data[0], null, 2)
        );
      }
    } else if (Array.isArray(response.data)) {
      // Direct array response
      data = response.data;
      console.log(`🔍 Found ${data.length} countries in response.data (array)`);

      // Log first item to see structure
      if (data.length > 0) {
        console.log(
          "🔍 Sample country data:",
          JSON.stringify(data[0], null, 2)
        );
      }
    } else {
      console.warn(
        "⚠️ Unexpected countries response structure:",
        response.data
      );
    }

    // Add extra debug logging to check for deleted items
    if (data.length > 0) {
      const hasDeletedItems = data.some((item: any) => item.isDeleted === true);
      console.log(
        `🚨 DEBUG: HAS DELETED ITEMS: ${hasDeletedItems ? "YES" : "NO"}`
      );

      if (hasDeletedItems) {
        const deletedItems = data.filter(
          (item: any) => item.isDeleted === true
        );
        console.log(
          `🚨 DEBUG: FOUND ${deletedItems.length} DELETED ITEMS OUT OF ${data.length}`
        );
        if (deletedItems.length > 0) {
          console.log(
            `🚨 DEBUG: FIRST DELETED ITEM:`,
            JSON.stringify(deletedItems[0], null, 2)
          );
        }
      }
    }

    return data || [];
  } catch (err) {
    console.error("❌ Error fetching countries:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for countries...");
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/country/get-countries?page=${page}&limit=${limit}${cacheParam}`,
        {
          withCredentials: false,
        }
      );

      console.log("⚙️ Direct countries request status:", directResponse.status);

      // Log data summary
      const dataStructureSummary = {
        hasData: !!directResponse.data,
        isDataObject:
          directResponse.data && typeof directResponse.data === "object",
        hasDataData: directResponse.data?.data !== undefined,
        isDataDataObject:
          directResponse.data?.data &&
          typeof directResponse.data.data === "object",
        hasDataDataData: directResponse.data?.data?.data !== undefined,
        isDataDataDataArray:
          directResponse.data?.data?.data &&
          Array.isArray(directResponse.data.data.data),
        dataDataDataLength:
          directResponse.data?.data?.data &&
          Array.isArray(directResponse.data.data.data)
            ? directResponse.data.data.data.length
            : "N/A",
        isDataArray: Array.isArray(directResponse.data),
        dataLength: Array.isArray(directResponse.data)
          ? directResponse.data.length
          : "N/A",
      };
      console.log(
        "⚙️ Direct request data structure summary:",
        dataStructureSummary
      );

      // Handle different possible response structures
      let directData = [];
      if (
        directResponse.data?.data?.data &&
        Array.isArray(directResponse.data.data.data)
      ) {
        // Most likely structure
        directData = directResponse.data.data.data;
        console.log(
          `⚙️ Found ${directData.length} countries in directResponse.data.data.data`
        );

        // Log first item to see structure
        if (directData.length > 0) {
          console.log(
            "⚙️ Sample country data (direct):",
            JSON.stringify(directData[0], null, 2)
          );
        }
      } else if (
        directResponse.data?.data &&
        Array.isArray(directResponse.data.data)
      ) {
        // Alternative structure
        directData = directResponse.data.data;
        console.log(
          `⚙️ Found ${directData.length} countries in directResponse.data.data`
        );

        // Log first item to see structure
        if (directData.length > 0) {
          console.log(
            "⚙️ Sample country data (direct):",
            JSON.stringify(directData[0], null, 2)
          );
        }
      } else if (Array.isArray(directResponse.data)) {
        // Direct array response
        directData = directResponse.data;
        console.log(
          `⚙️ Found ${directData.length} countries in directResponse.data (array)`
        );

        // Log first item to see structure
        if (directData.length > 0) {
          console.log(
            "⚙️ Sample country data (direct):",
            JSON.stringify(directData[0], null, 2)
          );
        }
      } else {
        console.warn(
          "⚠️ Unexpected direct countries response structure:",
          directResponse.data
        );
      }

      return directData || [];
    } catch (fallbackErr) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
      return [];
    }
  }
};

export const createAdminCountry = async (data: {
  name: string;
  slug: string;
  enName?: string;
  code?: string;
  phoneCode: string;
}): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/admin/country/create`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "کشور با موفقیت ایجاد شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error("Error creating country:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/country/create`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "کشور با موفقیت ایجاد شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      console.error(
        "Direct country creation fallback also failed:",
        fallbackErr
      );
      return {
        success: false,
        message: err.response?.data?.message || "ایجاد کشور با خطا مواجه شد",
      };
    }
  }
};

export const updateAdminCountry = async (
  id: string,
  data: {
    name: string;
    slug: string;
    enName?: string;
    code?: string;
    phoneCode: string;
  }
): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/admin/country/update/${id}`, data);
    return {
      success: response.data.success,
      message: response.data?.message || "کشور با موفقیت به‌روزرسانی شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error(`Error updating country ${id}:`, err);

    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/country/update/${id}`,
        data,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "کشور با موفقیت به‌روزرسانی شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      console.error("Direct country update fallback also failed:", fallbackErr);
      return {
        success: false,
        message:
          err.response?.data?.message || "به‌روزرسانی کشور با خطا مواجه شد",
      };
    }
  }
};

export const deleteAdminCountry = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/admin/country/delete/${id}`);
    return {
      success: response.data.success,
      message: response.data?.message || "کشور با موفقیت حذف شد",
    };
  } catch (err: any) {
    console.error(`Error deleting country ${id}:`, err);

    // Fallback to direct Axios call if the api instance fails
    try {
      const directResponse = await axios.delete(
        `${mainConfig.apiServer}/admin/country/delete/${id}`,
        {
          withCredentials: false,
        }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "کشور با موفقیت حذف شد",
      };
    } catch (fallbackErr: any) {
      console.error(
        "Direct country deletion fallback also failed:",
        fallbackErr
      );
      return {
        success: false,
        message: err.response?.data?.message || "حذف کشور با خطا مواجه شد",
      };
    }
  }
};

// --- Province ---
export const getAdminProvinces = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  const { page = 1, limit = 100, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    const response = await api.get(
      `/admin/province/get-provinces?page=${page}&limit=${limit}${cacheParam}`
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
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/province/get-provinces?page=${page}&limit=${limit}${cacheParam}`,
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
    console.error("Error creating province:", err);

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
      console.error(
        "Direct province creation fallback also failed:",
        fallbackErr
      );
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
    console.error(`Error updating province ${id}:`, err);

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
      console.error(
        "Direct province update fallback also failed:",
        fallbackErr
      );
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
    console.error(`Error deleting province ${id}:`, err);

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
      console.error(
        "Direct province deletion fallback also failed:",
        fallbackErr
      );
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete province",
      };
    }
  }
};

// --- City ---
export const getAdminCities = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  const { page = 1, limit = 100, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    const response = await api.get(
      `/admin/city/get-cities?page=${page}&limit=${limit}${cacheParam}`
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
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/city/get-cities?page=${page}&limit=${limit}${cacheParam}`,
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
    console.error("Error creating city:", err);

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
      console.error("Direct city creation fallback also failed:", fallbackErr);
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
    console.error(`Error updating city ${id}:`, err);

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
      console.error("Direct city update fallback also failed:", fallbackErr);
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
    console.error(`Error deleting city ${id}:`, err);

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
      console.error("Direct city deletion fallback also failed:", fallbackErr);
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
  const { page = 1, limit = 100, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    const response = await api.get(
      `/admin/area/get-areas?page=${page}&limit=${limit}${cacheParam}`
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
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/area/get-areas?page=${page}&limit=${limit}${cacheParam}`,
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
    console.error("Error creating area:", err);

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
      console.error("Direct area creation fallback also failed:", fallbackErr);
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
    console.error(`Error updating area ${id}:`, err);

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
      console.error("Direct area update fallback also failed:", fallbackErr);
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
    console.error(`Error deleting area ${id}:`, err);

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
      console.error("Direct area deletion fallback also failed:", fallbackErr);
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
    search
  } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";
  
  // Build query parameters for filters
  let queryParams = `page=${page}&limit=${limit}${cacheParam}`;
  
  // Add filter parameters if they exist
  if (roles) queryParams += `&roles=${roles}`;
  if (isActive !== undefined) queryParams += `&isActive=${isActive}`;
  if (isBanned !== undefined) queryParams += `&isBanned=${isBanned}`;
  if (isProfileComplete !== undefined) queryParams += `&isProfileComplete=${isProfileComplete}`;
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
      search
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

    const response = await api.get(
      `/admin/user/get-users?${queryParams}`,
      { headers }
    );

    console.log("🔍 Admin users API response status:", response.status);
    
    // Log the filtered results count
    if (response.data?.data && Array.isArray(response.data.data)) {
      console.log(`🔍 Filtered results: ${response.data.data.length} users found`);
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
      console.log(
        `🔍 Found ${response.data.data.length} users in response.data.data array`
      );
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      console.log(
        `🔍 Found ${response.data.length} users in response.data array`
      );
      return response.data;
    } else if (response.data && typeof response.data === "object") {
      // If the API returns {status, data, message, success} format
      // Return the entire response for the component to handle
      return response.data;
    } else {
      console.warn("⚠️ Unexpected users response structure:", response.data);
      return [];
    }
  } catch (err) {
    console.error("❌ Error fetching users:", err);

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
        console.log(
          `⚙️ Found ${directData.length} users in directResponse.data.data`
        );
      } else if (Array.isArray(directResponse.data)) {
        directData = directResponse.data;
        console.log(
          `⚙️ Found ${directData.length} users in directResponse.data (array)`
        );
      } else {
        console.warn(
          "⚠️ Unexpected direct users response structure:",
          directResponse.data
        );
      }

      return directData || [];
    } catch (fallbackErr) {
      console.error("❌ Direct Axios fallback also failed:", fallbackErr);
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
    console.error("Error creating user:", err);

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
      console.error("Direct user creation fallback also failed:", fallbackErr);
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
  console.log('updateAdminUser function called with id:', id);
  console.log('updateAdminUser data:', JSON.stringify(data, null, 2));
  
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
    console.log(`f504 Response message:`, response.data?.message || 'کاربر با موفقیت به‌روزرسانی شد');
    return {
      success: response.data.success,
      message: response.data?.message || "کاربر با موفقیت به‌روزرسانی شد",
      data: response.data?.data,
    };
  } catch (err: any) {
    console.error(`Error updating user:`, err);
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
      console.log(
        `⚙️ Direct update response:`,
        directResponse.status,
        directResponse.data
      );

      return {
        success: directResponse.data.success,
        message:
          directResponse.data?.message || "کاربر با موفقیت به‌روزرسانی شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      console.error("Direct user update fallback also failed:", fallbackErr);
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
    console.error(`❌ Error deleting user ${id}:`, err);
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
      console.error(
        "❌ Direct user deletion fallback also failed:",
        fallbackErr
      );
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
    console.error(`❌ Error restoring user ${id}:`, err);
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
      console.log(
        `⚙️ Direct restore response status: ${directResponse.status}`
      );
      console.log(`⚙️ Direct restore response data:`, directResponse.data);

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "کاربر با موفقیت بازیابی شد",
        data: directResponse.data?.data,
      };
    } catch (fallbackErr: any) {
      console.error(
        "❌ Direct user restoration fallback also failed:",
        fallbackErr
      );
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
  const { page = 1, limit = 10, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    console.log(
      `🔍 Fetching property types (force refresh: ${forceRefresh})...`
    );
    const response = await api.get(
      `/admin/property-type/get-property-types?page=${page}&limit=${limit}${cacheParam}`
    );

    console.log("🔍 Property types API response status:", response.status);

    // Log data summary
    const dataStructureSummary = {
      hasData: !!response.data,
      isDataObject: response.data && typeof response.data === "object",
      hasDataData: response.data?.data !== undefined,
      isDataDataObject:
        response.data?.data && typeof response.data.data === "object",
      hasDataDataData: response.data?.data?.data !== undefined,
      isDataDataDataArray:
        response.data?.data?.data && Array.isArray(response.data.data.data),
    };
    console.log("🔍 Data structure summary:", dataStructureSummary);

    // Handle different possible response structures
    let data = [];
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
      console.log(
        `🔍 Found ${data.length} property types in response.data.data.data`
      );
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
      console.log(
        `🔍 Found ${data.length} property types in response.data.data`
      );
    } else if (Array.isArray(response.data)) {
      data = response.data;
      console.log(
        `🔍 Found ${data.length} property types in response.data (array)`
      );
    } else {
      console.warn(
        "⚠️ Unexpected property types response structure:",
        response.data
      );
    }

    return data || [];
  } catch (err) {
    console.error("❌ Error fetching property types:", err);
    return [];
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
      console.log(
        `🔍 Found ${data.length} filters in response.data.data.data`
      );
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;

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

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers['x-access-token'] = token;

      const directResponse = await axios.get(
        `${mainConfig.apiServer}/admin/filter/filter/${id}`,
        { headers }
      );

      console.log(`⚙️ Direct fallback response status: ${directResponse.status}`);
      console.log(`⚙️ Direct fallback data:`, directResponse.data);

      return {
        success: directResponse.data.success,
        data: directResponse.data.data || directResponse.data,
        message: directResponse.data.message || "اطلاعات فیلتر با موفقیت دریافت شد",
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
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;

    const response = await api.post(`/admin/filter/create`, data, { headers });
    
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
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers['x-access-token'] = token;

      const directResponse = await axios.post(
        `${mainConfig.apiServer}/admin/filter/create`,
        data,
        { headers }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "فیلتر با موفقیت ایجاد شد",
        data: directResponse.data?.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct filter creation fallback also failed:", fallbackErr);
      
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
    console.log(`🔍 Updating filter ID: ${id} with data:`, JSON.stringify(data, null, 2));
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;

    const response = await api.put(`/admin/filter/update/${id}`, data, { headers });
    
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
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers['x-access-token'] = token;

      const directResponse = await axios.put(
        `${mainConfig.apiServer}/admin/filter/update/${id}`,
        data,
        { headers }
      );

      return {
        success: directResponse.data.success,
        message: directResponse.data?.message || "فیلتر با موفقیت به‌روزرسانی شد",
        data: directResponse.data?.data,
        status: directResponse.status,
      };
    } catch (fallbackErr: any) {
      console.error("❌ Direct filter update fallback also failed:", fallbackErr);
      
      return {
        success: false,
        message: error.response?.data?.message || "به‌روزرسانی فیلتر با خطا مواجه شد",
        status: error.response?.status,
      };
    }
  }
};

export const deleteAdminFilter = async (id: string): Promise<ApiResponse> => {
  try {
    console.log(`🗑️ Deleting filter with ID: ${id}`);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;

    const response = await api.delete(`/admin/filter/delete/${id}`, { headers });
    
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
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers['x-access-token'] = token;

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
      console.error("❌ Direct filter deletion fallback also failed:", fallbackErr);
      
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
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {};
    if (token) headers['x-access-token'] = token;

    const response = await api.put(`/admin/filter/restore/${id}`, {}, { headers });
    
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
      console.log(`⚙️ Attempting direct Axios fallback for filter restoration...`);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers['x-access-token'] = token;

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
      console.error("❌ Direct filter restoration fallback also failed:", fallbackErr);
      
      return {
        success: false,
        message: error.response?.data?.message || "بازیابی فیلتر با خطا مواجه شد",
        status: error.response?.status,
      };
    }
  }
};

//#endregion



