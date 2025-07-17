import { create } from "zustand";
import toast from "react-hot-toast";
// import axios from "../../lib/axios"; 
import axiosInstance from "../lib/axios";
import { useUserStore } from "./useUserStore";
export const useProductStore = create((set) => ({
	products: [],
	loading: false,
error:null,
	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		
		try {
			const userId = useUserStore.getState().user?.id;

			    if (!userId) {
      toast.error("User not logged in");
      set({ loading: false });
      return;
    }

			const res = await axiosInstance.post(`/api/products/${userId}`, productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			console.log("Product created successfully:", res.data);
		} catch (error) {
			toast.error(error?.response?.data?.error);
			set({ loading: false });
		}
	},
	// fetchAllProducts: async () => {
	// 	set({ loading: true });
	// 	try {
	// 		const response = await axios.get("/products");
	// 		set({ products: response.data.products, loading: false });
	// 	} catch (error) {
	// 		set({ error: "Failed to fetch products", loading: false });
	// 		toast.error(error.response.data.error || "Failed to fetch products");
	// 	}
	// },

fetchAllProducts: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get('api/products');


    set({ products:response.data, loading: false });
  } catch (error) {
    set({ error: "Failed to fetch products", loading: false });
    toast.error(error?.response?.data?.error || "Failed to fetch products");
  }
},
	
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axiosInstance.get(`/api/products/category/${category}`);
			set({ products: response.data, loading: false });
		} catch (error) {
			  const message = error?.response?.data?.message || "Failed to fetch products";
      set({ error: message, loading: false });
      toast.error(message);
			// set({ error: "Failed to fetch products", loading: false });
			// toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
		 fetchProductByid: async (productId) => {
		  try {

			 const res = await axiosInstance.get(`/api/products/id/${productId}`);
			 return res.data;
		  } catch (error) {
			toast.error(error.message || "Error loading product");
			return null;
		  } 
		},
	deleteProduct: async (productId) => {
  set({ loading: true });
  try {
    await axiosInstance.delete(`/api/products/${productId}`);
    set((state) => ({
      products: state.products.filter((p) => p._id !== productId),
      loading: false,
    }));
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data?.error || "Failed to delete product");
  }
},
	// deleteProduct: async (productId) => {
	// 	set({ loading: true });
	// 	try {
	// 		await axios.delete(`/products/${productId}`);
	// 		set((prevProducts) => ({
	// 			products: prevProducts.products.filter((product) => product._id !== productId),
	// 			loading: false,
	// 		}));
	// 	} catch (error) {
	// 		set({ loading: false });
	// 		toast.error(error.response.data.error || "Failed to delete product");
	// 	}
	// },
	

}));