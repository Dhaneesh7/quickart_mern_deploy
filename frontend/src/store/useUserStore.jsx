import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { persist } from "zustand/middleware";

export const useUserStore = create(
	persist(

	(set, get) => ({
	user: null,
loading: true,
	checkingAuth: true,
	setUser: (user) => set({ user }),

	signup: async ({ name, email, password, confirmPassword, role }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axiosInstance.post("/api/auth/signup", { name, email, password ,role },  { withCredentials: true });
			if (res?.data) {
				const user = res.data;
				console.log("Signup response user:", user);
				set({ user:{id:user._id ,name:user.name,email:user.email,role:user.role}, loading: false });

				toast.success("Signup successful");
			  return true;
			}	
		} catch (error) {
			set({ loading: false });
			
		const message =
			error?.response?.data?.message ||
			error?.message ||
			"An error occurred during signup";
			toast.error(message);
			console.error("Signup error:", message);
		}
	},
	setuserById: async (userId,{silent=false}={}) => {
		set({ loading: true });
		try {
			const res = await axiosInstance.get(`/api/auth/user/${userId}`);
			if (res?.data) {
				const u = res.data;
    set({
       user: { id: u._id, name: u.name, email: u.email },
       loading: false
     });
				    if (!silent) {
      toast.success("User data fetched successfully"); 
      console.log("Fetched user by ID", u);
    }// set({ user: res.data, loading: false });
				return true;
			}
		} catch (error) {
			set({ loading: false });
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"An error occurred while fetching user data";
			toast.error(message);
			console.error("Fetch user error:", message);	
		}
		return false;
	},
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axiosInstance.post("/api/auth/login", { email, password }  ,{ withCredentials: true });
    //  const user = res.data;
	console.log("response login",res.data);
	 const { accessToken, refreshToken, ...userData } = res.data;
	    console.log("Login response user:", user); 
			set({ user: {id:userData._id,name:userData.name,email:userData.email,role:userData.role,accessToken:accessToken}, loading: false });
			console.log("User logged in:", get().user);
			return true;
			
		} catch (error) {
			set({ loading: false });
			toast.error(error?.response?.data?.message || "An error occurred");
			return false;
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/api/auth/logout");
			set({ user: null });
		
		toast.success("Logged out");
		} catch (error) {
			toast.error(error?.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await fetch("https://quickart-mern-deploy.onrender.com/api/auth/profile",  {  credentials: 'include'});
			// set({ user: response.data, checkingAuth: false });
			   const u = response.data;
			   	console.log("response checkauth",u);

  set({
     user: { id: u._id, name: u.name, email: u.email },
     checkingAuth: false
   });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
// 		// Prevent multiple simultaneous refresh attempts
// 		if (get().checkingAuth) return;

// 		set({ checkingAuth: true });
// 		try {
// 			const response = await axiosInstance.post("/api/auth/refresh-token");
// 			// set({ checkingAuth: false });
// 				await get().checkAuth();
// 			return response.data;
// 		} catch (error) {
// 			set({ user: null, });
// 			  toast.error("Session expired. Please log in again.");
// 			throw error;
// 		}
// 		 finally {
//     set({ checkingAuth: false }); // moved here to always run
//   }
  set({ checkingAuth: true });
  try {
    const { data } = await axiosInstance.post("/api/auth/refresh-token",  { withCredentials: true });
    set(state => ({
      user: { ...state.user, accessToken: data.accessToken }
    }));
    return data.accessToken;
  } catch (err) {
    set({ user: null , checkingAuth: false });
    toast.error("Session expired. Please log in again.");
    throw err;
  } finally {
    set({ checkingAuth: false });
  }

	},
}),{
	name: "userStore",
	    partialize: (state) => ({ user: state.user }), // 💡 only persist `user`
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;
axiosInstance.interceptors.request.use(
  config => {
    const token = useUserStore.getState().user?.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
  if (!refreshPromise) {
        refreshPromise = useUserStore.getState().refreshToken();
      }
			try {await refreshPromise;
        return axiosInstance(original);
				// If a refresh is already in progress, wait for it to complete
				// if (refreshPromise) {
				// 	await refreshPromise;
				// 	return axiosInstance(originalRequest);
				// }

				// // Start a new refresh process
				// refreshPromise = useUserStore.getState().refreshToken();
				// await refreshPromise;
				

				// return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				await useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
			 finally {
  refreshPromise = null; // always reset
}
		}
		return Promise.reject(error);
	}

);