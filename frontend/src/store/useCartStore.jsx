import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useUserStore } from "./useUserStore";
const initialState = { cart: [], subtotal: 0, total: 0 };
export const useCartStore = create((set, get) => ({
  // cart: [],
  // total: 0,
  // subtotal: 0,
     ...initialState,
  getCartItems: async () => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) {
      console.error("No user id found when fetching cart");
      return;
    }
    try {
      const res = await axiosInstance.get(`/api/carts/${userId}`);
      const cartItemsFromBackend = res.data;

      // Correct the mapping to access quantity from item.quantity, not item.item.quantity
      const formattedCart = cartItemsFromBackend.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,  // <-- Fix this line
      }));

      set({ cart: formattedCart });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },





  clearCart: async () => {
       const userId = useUserStore.getState().user?.id;
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
     try {
      // Fix endpoint: your backend expects DELETE /carts/:userId with productId in body
      await axiosInstance.delete(`/api/carts/all/${userId}`, { data: { productId } });
   set({...initialState});
     }catch{
      
     }
  },

  addToCart: async (product) => {
    try {
      const userId = useUserStore.getState().user?.id;
      if (!userId) throw new Error("User not logged in");

      await axiosInstance.post(`/api/carts/${userId}`, { productId: product._id,quantity: product.quantity ||1});
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);
        const updatedCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: updatedCart };
      });
      get().calculateTotals();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(errorMessage);
    }
  },

  removeFromCart: async (productId) => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    try {
      // Fix endpoint: your backend expects DELETE /carts/:userId with productId in body
      await axiosInstance.delete(`/api/carts/${userId}`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    const userId = useUserStore.getState().user?.id;
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    try {
      // Fix endpoint: your backend expects PUT /carts/:userId/:productId
      await axiosInstance.put(`/api/carts/${userId}/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
      toast.success("Quantity updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update quantity");
    }
  },

  calculateTotals: () => {
    const { cart } = get();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    set({ subtotal, total: subtotal });
  },
}));
