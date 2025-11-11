import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // A backend portja
});


export default API;
