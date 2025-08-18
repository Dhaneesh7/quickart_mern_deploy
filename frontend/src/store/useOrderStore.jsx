import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useUserStore } from "./useUserStore";
import toast from "react-hot-toast";
import { useCartStore } from "./useCartStore";

export const useOrderStore = create((set) => ({
  loading: false,
  orders: [],

  // ✅ Add a single product to orders
  addOrder: async ({ productId, quantity = 1 }) => {
    try {
      const userId = useUserStore.getState().user?.id;
      if (!userId) {
        toast.error("User not logged in");
        return false;
      }

      set({ loading: true });
      const response = await axiosInstance.post(`/api/orders/${userId}`, {
        productId,
        quantity,
      });

      set({ orders: response.data, loading: false });
      toast.success("Product added to orders");
      return true;
    } catch (error) {
      console.error("Order failed:", error);
      toast.error(error?.response?.data?.message || "Failed to add order");
      set({ loading: false });
      return false;
    }
  },

  // ✅ Fetch all orders
  fetchOrders: async () => {
    try {
      const userId = useUserStore.getState().user?.id;
      if (!userId) return;

      const response = await axiosInstance.get(`/api/orders/${userId}`);
      set({ orders: response.data });
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Could not load orders");
    }
  },

  // ✅ Move Cart → Orders
  CartToStore: async () => {
    const userId = useUserStore.getState().user?.id;
    const cartItems = useCartStore.getState().cart;

    if (!userId) {
      toast.error("User not logged in");
      return false;
    }
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    try {
      const { data } = await axiosInstance.post(`/api/orders/cart/${userId}`, {
        cartItems,
      });

      set({ orders: data.orderItems });
      toast.success("Cart items moved to orders");
      return true;
    } catch (error) {
      console.error("CartToStore error:", error);
      toast.error(error?.response?.data?.message || "Failed to move cart to orders");
      return false;
    }
  },

  // ✅ Remove order item by orderId
  removeOrderItem: async (orderId) => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) {
      toast.error("User not logged in");
      return false;
    }

    try {
      const { data } = await axiosInstance.delete(`/api/orders/${userId}/${orderId}`);
      set({ orders: data.orderItems });

      toast.success("Product removed from orders");
      return true;
    } catch (error) {
      console.error("Remove order error:", error);
      toast.error(error?.response?.data?.message || "Failed to remove product");
      return false;
    }
  },
}));
