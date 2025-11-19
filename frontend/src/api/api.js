import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const register = async (data) => {
  return axios.post(`${API_URL}/register`, data);
};
