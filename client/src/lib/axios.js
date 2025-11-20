import axios from "axios";

const baseURL =
import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://backend-sfcg-task.onrender.com/api";

const axiosInstance = axios.create({
  baseURL,  
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;



