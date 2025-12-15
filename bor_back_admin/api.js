import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true // 🍪 cookie!
});

let isRefreshing = false;
let queue = [];

API.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry
    ) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise(resolve => {
          queue.push(token => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(API(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await API.post("/auth/refresh");
        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);
        API.defaults.headers.Authorization = `Bearer ${newToken}`;

        queue.forEach(cb => cb(newToken));
        queue = [];

        return API(original);
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 🔑 REQUEST: access token
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
