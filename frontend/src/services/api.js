import axios from "axios";

const API = axios.create({
  baseURL: "https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api"
});

// Attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;