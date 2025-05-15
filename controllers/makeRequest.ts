import { api, returnError } from "@/lib/api";
import { GenericAbortSignal } from "axios";
import mainConfig from "@/configs/mainConfig";
import axios from "axios";

//#region Auth
export const sendOtpCode = async (
  mobile_number: string,
  countryCode: string
) => {
  try {
    const response = await api.post("/login", { mobile_number, countryCode });
    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const verifyOtp = async (mobile_number: string, active_code: string) => {
  try {
    const response = await api.post("/login/otp", {
      mobile_number,
      active_code,
    });
    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};
export const sendInvitation = async (
  token: string,
  mobile_number: string,
  role: string
) => {
  try {
    // Define modedrole outside the if/else block so it's accessible in the API call
    let modedrole = 1; // Default value for "مشاور املاک"
    if (role === "مدیر منطقه") {
      modedrole = 2;
    }

    // Create headers object
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.post(
      `${mainConfig.apiServer}/send-request`,
      {
        mobile_number,
        role: modedrole,
      },
      { headers }
    );

    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

//#endregion

//#region Locations
export const getCountries = async () => {
  try {
    const response = await api.get("/list-countries");
    return response.data || [];
  } catch (err) {
    return returnError(err);
  }
};
export const getProvinces = async (countrySlug: string) => {
  try {
    const response = await api.post("/provinces", { slug: countrySlug });
    return response.data || [];
  } catch (err) {
    return returnError(err);
  }
};
export const getCities = async (provinceSlug: string) => {
  try {
    const response = await api.post("/cities", { slug: provinceSlug });
    return response.data || [];
  } catch (err) {
    return returnError(err);
  }
};
export const getAreas = async (citySlug: string) => {
  try {
    const response = await api.post("/neighborhoods", { slug: citySlug });
    return response.data || [];
  } catch (err) {
    return returnError(err);
  }
};
//#endregion

//#region User
export const getUser = async (token: string) => {
  try {
    const response = await api.get("/getuser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const updateUser = async (token: string, data: any) => {
  try {
    const fullUrl = `${mainConfig.apiServer}/completeprofile`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    console.log("💡 Request headers:", headers);
    console.log("💡 Is FormData?", data instanceof FormData);

    // Log FormData entries
    if (data instanceof FormData) {
      console.log("💡 FormData contents:");
      for (let pair of data.entries()) {
        console.log(`   ${pair[0]}: ${pair[1]}`);
      }
    }

    console.log("💡 Sending request...");

    // Don't set Content-Type header for FormData - browser will set it with correct boundary
    const response = await api.post("/completeprofile", data, {
      headers,
    });

    return { ...response.data, status: response.status };
  } catch (error: any) {
    console.error("💡 Error in updateUser:", error);
    if (error.response) {
      console.error("💡 Error response status:", error.response.status);
      console.error("💡 Error response data:", error.response.data);
    } else if (error.request) {
      console.error("💡 No response received. Request:", error.request);
    } else {
      console.error("💡 Error message:", error.message);
    }
    return returnError(error);
  }
};
//#endregion

//#region Categories
export const getCategories = async (propertyTypeSlug: string) => {
  try {
    const response = await api.post("/CategorizedPropertyType", {
      slug: propertyTypeSlug,
    });
    return response.data || [];
  } catch (err) {
    return returnError(err);
  }
};
//#endregion

//#region Advertisement
export const getAdvertisements = async (
  filters: any,
  page: number,
  limit: number,
  token?: string
) => {
  console.log("limit", limit);

  try {
    const response = await api.post(
      `/filter-elan?page=${page}&limit=${limit}`,
      filters
    );
    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getPropertyFilters = async (slug: string) => {
  try {
    const response = await api.post(`/Featurerelated`, { slug });
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const globalSearch = async (
  filterText: string,
  signal: GenericAbortSignal | undefined
) => {
  try {
    const response = await api.post(
      `/search`,
      { query: filterText },
      { signal }
    );

    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const fetchTitle = async (slug: string) => {
  try {
    const response = await api.get(`/FindTitleBySlug?slug=${slug}`);
    return response.data.title;
  } catch (err) {
    return returnError(err);
  }
};

export const getAdvertisement = async (id: string, token?: string) => {
  try {
    const response = await api.get(`/advertisements/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const handleFavorite = async (
  id: string,
  type: string,
  token: string
) => {
  try {
    const response = await api.post(
      `/BookMark`,
      { id, type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};
//#endregion

//#region Dashboard
export const getLastViewed = async (token: string, page: number = 1) => {
  try {
    const response = await api.post(
      `/UserElanProfile?page=${page}`,
      { type: "lastseen" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(" data:", response.data, "status : ", response.status);
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getUserAds = async (token: string, page: number = 1) => {
  try {
    const response = await api.post(
      `/UserElanProfile?page=${page}`,
      { type: "myestate" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getUserBookmarks = async (token: string, page: number = 1) => {
  try {
    const response = await api.post(
      `/UserElanProfile?page=${page}`,
      { type: "bookmark" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("getUserBookmarks ------------------", response.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};
//#endregion

//#region Realestate
export const getRealestateData = async (id: string) => {
  try {
    const response = await api.get(`/ShowManagerConsulting/${id}`);
    return response.data || [];
  } catch (err) {
    return returnError(err);
  }
};

export const getCompanyHeader = async () => {
  try {
    const response = await api.get("/api/company/header");
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getCompanyMembers = async () => {
  try {
    const response = await api.get("/api/company/members");
    return { data: response.data.members, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getCompanyProperties = async (
  page: number = 1,
  limit: number = 9
) => {
  try {
    const response = await api.get(
      `/api/properties?page=${page}&limit=${limit}`
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};
//#endregion

//#region Support
export const submitSupportTicket = async (
  token: string,
  data: {
    title: string;
    description: string;
    contactEmail?: string;
    type: "bug" | "support";
  }
) => {
  try {
    const response = await api.post("/api/support/ticket", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getUserTickets = async (token: string) => {
  try {
    const response = await api.post("/api/support/ticket", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};
//#endregion

export const createAdvertisementStep1 = async (data: any, token: string) => {
  try {
    const response = await api.post("/AdvertisementCreateStep1APIView", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const getFeatureRelatedFields = async (propertyTypeSlug: string) => {
  try {
    const response = await api.post("/FeatureRelatedAPIViewAddView", {
      slug: propertyTypeSlug,
    });
    return response.data;
  } catch (err) {
    return returnError(err);
  }
};

export const createAdvertisementStep2 = async (data: any, token: string) => {
  try {
    const response = await api.post("/AdvertisementCreateStep2APIView", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ...response.data, status: response.status };
  } catch (err) {
    return returnError(err);
  }
};

export const createAdvertisementStep3 = async (data: any, token: string) => {
  try {
    console.log("createAdvertisementStep3 function called");
    console.log("Using API server:", mainConfig.apiServer);

    const fullUrl = `${mainConfig.apiServer}/AdvertisementStep3APISimple`;
    console.log("Full API URL:", fullUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Import axios directly for this call to bypass Next.js API routes
    const axios = (await import("axios")).default;

    const response = await axios.post(fullUrl, data, {
      headers,
    });

    console.log("API response received:", response.status);
    return { ...response.data, status: response.status };
  } catch (err) {
    console.error("Error in createAdvertisementStep3:", err);
    return returnError(err);
  }
};

export const registerAgency = async (token: string, data: FormData) => {
  try {
    console.log("🏢 registerAgency function called");
    console.log("🏢 API Server URL:", mainConfig.apiServer);
    const fullUrl = `${mainConfig.apiServer}/RegisterAgencyView`;
    console.log("🏢 Full API URL being called:", fullUrl);

    console.log(
      "🏢 Sending agency registration with token:",
      token ? `Token exists (length: ${token.length})` : "No token"
    );

    // Don't set Content-Type header for FormData - browser will set it with correct boundary
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    console.log("🏢 Request headers:", headers);
    console.log("🏢 Is FormData?", data instanceof FormData);

    // Log FormData entries
    if (data instanceof FormData) {
      console.log("🏢 FormData contents:");
      for (let pair of data.entries()) {
        console.log(`   ${pair[0]}: ${pair[1]}`);
      }
    }

    console.log("🏢 Sending request...");

    const response = await api.post("/RegisterAgencyView", data, {
      headers,
    });

    return { ...response.data, status: response.status };
  } catch (error: any) {
    console.error("🏢 Error in registerAgency:", error);
    if (error.response) {
      console.error("🏢 Error response status:", error.response.status);
      console.error("🏢 Error response data:", error.response.data);
    } else if (error.request) {
      console.error("🏢 No response received. Request:", error.request);
    } else {
      console.error("🏢 Error message:", error.message);
    }
    return returnError(error);
  }
};

export const getUserNotifications = async (token: string) => {
  try {
    console.log("Fetching user notifications...");
    // Define the correct API endpoint URL
    const apiUrl = `${mainConfig.apiServer}/MessageElanProfileView`;
    console.log("Using direct API URL:", apiUrl);

    console.log(
      "Authorization token:",
      token ? `Token exists (length: ${token.length})` : "No token"
    );

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    console.log("Request headers:", headers);

    // Import axios directly to make the request to the specific endpoint
    const axios = (await import("axios")).default;
    const response = await axios.get(apiUrl, {
      headers,
    });

    console.log("Notifications response status:", response.status);
    console.log("Notifications response data:", response.data);

    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error("Error fetching notifications:", err);
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    } else if (err.request) {
      console.error("No response received. Request:", err.request);
    } else {
      console.error("Error message:", err.message);
    }
    return returnError(err);
  }
};

//#region AdminRegions
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// --- Country ---
export const getAdminCountries = async (
  params: { page?: number; limit?: number; forceRefresh?: boolean } = {}
): Promise<any[]> => {
  const { page = 1, limit = 100, forceRefresh = false } = params;

  // Add cache-busting parameter if forceRefresh is true
  const cacheParam = forceRefresh ? `&_t=${Date.now()}` : "";

  try {
    console.log(`🔍 Fetching countries (force refresh: ${forceRefresh})...`);
    const response = await api.get(
      `/api/country/get-countries?page=${page}&limit=${limit}${cacheParam}`
    );

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

    return data || [];
  } catch (err) {
    console.error("❌ Error fetching countries:", err);

    // Fallback to direct Axios call if the api instance fails
    try {
      console.log("⚙️ Attempting direct Axios fallback for countries...");
      const directResponse = await axios.get(
        `${mainConfig.apiServer}/api/country/get-countries?page=${page}&limit=${limit}${cacheParam}`,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      `/api/province/get-provinces?page=${page}&limit=${limit}${cacheParam}`
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
        `${mainConfig.apiServer}/api/province/get-provinces?page=${page}&limit=${limit}${cacheParam}`,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      `/api/city/get-cities?page=${page}&limit=${limit}${cacheParam}`
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
        `${mainConfig.apiServer}/api/city/get-cities?page=${page}&limit=${limit}${cacheParam}`,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      `/api/area/get-areas?page=${page}&limit=${limit}${cacheParam}`
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
        `${mainConfig.apiServer}/api/area/get-areas?page=${page}&limit=${limit}${cacheParam}`,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
      success: response.status >= 200 && response.status < 300,
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
        success: directResponse.status >= 200 && directResponse.status < 300,
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
