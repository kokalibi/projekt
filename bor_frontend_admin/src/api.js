import axios from "axios";

const adminApi = axios.create({
  baseURL: "/api",
});

adminApi.interceptors.request.use(config => {
  // Ez a változó oldalfrissítéskor (F5) törlődik a memóriából
  const token = window.__ADMIN_TOKEN__; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;