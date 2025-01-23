import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const getUnitInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/units`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payments:", error);
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