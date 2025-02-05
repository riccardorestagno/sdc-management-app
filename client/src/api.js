import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const getUnitInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/units`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unit:", error);
    throw error;
  }
};

export const getYears = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/years`);
    return response.data;
  } catch (error) {
    console.error("Error fetching years:", error);
    throw error;
  }
};

export const getPayments = async (year) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const getOwnerInfoByUnitAddressId = async (unit_address_id) => {
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

export const getFiscalYear = async (year) => {
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


export const updatePayment = async (year, paymentData) => {
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
    console.error("Error updating payment:", error.response?.data || error.message);
    throw error;
  }
};

export const initializeFiscalYear = async (year, fiscalYearData) => {
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
    console.error("Error initializing new fiscal year:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteFiscalYear = async (year) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/payments/${year}`);
    console.log("Fiscal year deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting new fiscal year:", error.response?.data || error.message);
    throw error;
  }
};