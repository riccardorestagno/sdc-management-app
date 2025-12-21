import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface OwnerUpdateRequest {
  name: string;
  email: string;
  number: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

// Token decryption utility (matching authContext.tsx)
const decryptToken = (encrypted: string): string | null => {
  try {
    const key = "SDC_SECURE_KEY_2025";
    const decoded = atob(encrypted);
    let decrypted = "";
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  } catch {
    return null;
  }
};

// Axios request interceptor - adds auth token to all requests
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get encrypted token from localStorage
    const encryptedToken = localStorage.getItem("auth_token");
    
    if (encryptedToken) {
      const token = decryptToken(encryptedToken);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add CSRF protection header
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    
    // Add security headers
    config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor - handles token expiration and errors
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear stored tokens
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error("Access denied: Insufficient permissions");
    }
    
    // Handle network errors
    if (!error.response) {
      console.error("Network error: Unable to reach server");
    }
    
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getUnitInfoList = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/units`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unit:", error);
    throw error;
  }
};

export const getYears = async (): Promise<number[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fiscal-years`);
    return response.data.map((fiscalYear: { year: number }) => fiscalYear.year);
  } catch (error) {
    console.error("Error fetching years:", error);
    throw error;
  }
};

export const getPayments = async (year: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const getOwnerInfoByUnitAddressId = async (unit_address_id: string | null): Promise<any> => {
  try {
    if (!unit_address_id) {
      return {};
    }
    const response = await axios.get(`${API_BASE_URL}/owners/unit/${unit_address_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching owner info:", error);
    throw error;
  }
};

export const updateOwnerInfoByUnitAddressId = async (unit_address_id: string | null, updated_owner_info: OwnerUpdateRequest): Promise<any> => {
  try {
    if (!unit_address_id) {
      return {};
    }
    const response = await axios.put(`${API_BASE_URL}/owners/unit/${unit_address_id}`, updated_owner_info);
    return response.data;
  } catch (error) {
    console.error("Error fetching owner info:", error);
    throw error;
  }
};

export const getFiscalYear = async (year: number): Promise<any> => {
  try {
    if (!year) {
      return {};
    }
    const response = await axios.get(`${API_BASE_URL}/fiscal-years/year/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fiscal year data:", error);
    throw error;
  }
};

export const updatePayment = async (year: number, paymentData: object): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/payments/${year}`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Payment updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    throw error;
  }
};

export const initializeFiscalYear = async (year: number, fiscalYearData: object): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/${year}/init`,
      fiscalYearData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fiscal year initialized successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error initializing new fiscal year:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    throw error;
  }
};

export const deleteFiscalYear = async (year: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/payments/${year}`);
    console.log("Fiscal year deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting new fiscal year:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    throw error;
  }
};
