import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true // ⬅️ COOKIEK MIATT KÖTELEZŐ
});

export default API;
