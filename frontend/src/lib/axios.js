import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000" : "/api",
  // baseURL: '/api', // Use relative path for Vite proxy
  withCredentials: true, // ✅ this is enough to send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ Remove this interceptor unless you're switching to header-based auth
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosInstance;
