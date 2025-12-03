import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// TOKEN HOZZÁADÁSA, HA VAN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
