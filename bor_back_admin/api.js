import axios from "axios";

const adminApi = axios.create({
  baseURL: "/api",
});

adminApi.interceptors.request.use(config => {
  const token = window.__ADMIN_TOKEN__;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
