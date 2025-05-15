import mainConfig from "@/configs/mainConfig";

/**
 * Makes an authenticated API request
 * @param url API endpoint (without base URL)
 * @param options Fetch options
 * @param token Access token (optional, will check localStorage if not provided)
 * @returns Response from API
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  // Get token from localStorage if not provided
  const accessToken = token || localStorage.getItem("accessToken");

  // Prepare headers
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // Add authentication header if token exists
  if (accessToken) {
    headers.set("x-access-token", accessToken);
  }

  // Make the request
  const response = await fetch(`${mainConfig.apiServer}${url}`, {
    ...options,
    headers,
  });

  // Handle response
  if (!response.ok) {
    // If unauthorized, clear token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }

    // Try to get error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  // Return parsed data
  return await response.json();
}

/**
 * Makes a GET request to the API
 * @param url API endpoint (without base URL)
 * @param token Access token (optional)
 * @returns Response from API
 */
export function get<T>(url: string, token?: string): Promise<T> {
  return apiRequest<T>(url, { method: "GET" }, token);
}

/**
 * Makes a POST request to the API
 * @param url API endpoint (without base URL)
 * @param data Data to send (will be JSON stringified)
 * @param token Access token (optional)
 * @returns Response from API
 */
export function post<T>(url: string, data: any, token?: string): Promise<T> {
  return apiRequest<T>(
    url,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    token
  );
}

/**
 * Makes a PUT request to the API
 * @param url API endpoint (without base URL)
 * @param data Data to send (will be JSON stringified)
 * @param token Access token (optional)
 * @returns Response from API
 */
export function put<T>(url: string, data: any, token?: string): Promise<T> {
  return apiRequest<T>(
    url,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    token
  );
}

/**
 * Makes a DELETE request to the API
 * @param url API endpoint (without base URL)
 * @param token Access token (optional)
 * @returns Response from API
 */
export function del<T>(url: string, token?: string): Promise<T> {
  return apiRequest<T>(url, { method: "DELETE" }, token);
}
