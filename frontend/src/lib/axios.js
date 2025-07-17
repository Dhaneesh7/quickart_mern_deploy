import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? '/api'  // dev paths go through proxy
    : import.meta.env.VITE_API_BASE_URL + '/api',
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
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
