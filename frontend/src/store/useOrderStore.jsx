import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useUserStore } from "./useUserStore";
import toast from "react-hot-toast";
import { useCartStore } from "./useCartStore";
export const useOrderStore = create((set) => ({
  loading: false,
  orders: [],
  addOrder: async (orderData) => {
    try {
           const userId = useUserStore.getState().user?.id;
      set({ loading: true });
      const response = await axiosInstance.post(`/api/orders/${userId}`, orderData); // adjust to your backend API
      set((state) => ({
        orders: [...state.orders, response.data],
        loading: false,
      }));
      return true;
    } catch (error) {
      console.error("Order failed:", error);
      set({ loading: false }); 
      return false;
    }
  },
  fetchOrders: async () => {
    try {
                   const userId = useUserStore.getState().user?.id;

      const response = await axiosInstance.get(`/api/orders/${userId}`);
      set({ orders: response.data });
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  },
  CartToStore: async () => {
    const userId = useUserStore.getState().user?.id;

    const cartItems = useCartStore.getState().cart; // Assuming cart items are stored in user store
        console.log("Cart items to store:", cartItems);
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return false;
    }
    if (!userId) {
      toast.error("User not logged in");
      return false;
    }
    try {
      const {data} = await axiosInstance.post(`/api/orders/cart/${userId}`, { cartItems:cartItems });
      console.log("Response from CartToStore:",data);
      set((state) => ({
        orders: [...state.orders, ...data],
        // orders: [...state.orders, cartItems],
      }));
      toast.success("Cart items added to orders");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add cart items to orders");
    }
  },

   removeOrderItem: async (orderId) => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    try {
      // Fix endpoint: your backend expects DELETE /carts/:userId with productId in body
await axiosInstance.delete(`/api/orders/${userId}/${orderId}`);

      set((prevState) => ({
        orders: prevState.orders.filter((item) => item._id !== orderId),
      }));
      get().calculateTotals();
      toast.success("Product removed from orders");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  },
}));
