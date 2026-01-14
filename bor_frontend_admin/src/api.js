import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true 
});

// Interceptor az Admin token automatikus hozzáadásához
API.interceptors.request.use((config) => {
  // Megpróbáljuk változóból, ha nincs ott, akkor a tárolóból
  const token = window.__ADMIN_TOKEN__ || sessionStorage.getItem("admin_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;