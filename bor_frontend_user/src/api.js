import axios from "axios";

const API = axios.create({
  // A .env fájlod alapján a backend a 8080-as porton van:
  baseURL: "http://localhost:8080/api", 
  withCredentials: true // Ez engedi át a sütiket (refreshToken)
});

export default API;