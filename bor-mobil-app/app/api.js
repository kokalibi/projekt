import axios from "axios";

const API = axios.create({
  // Az Expo automatikusan beolvassa a .env-ből
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

export default API;