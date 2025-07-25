import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
// import { useUserStore } from "../store/useUserStore";
// import axios from "axios";
import axiosInstance from "../lib/axios";
const stripePromise = loadStripe(
  "pk_test_51RaWhqH9FCrDK0ULWAYDWcJzMJ5CWZuoUAXLgCR6KpPARhq3xNAtrbTuIyHpCW9yqhN9taojvfeSYGgyiysifzJK00dgL2QG55"
);

export default function OrderSummary({ theme }) {
  const navigate = useNavigate();
  const { cart, total } = useCartStore();
  const clearCart = useCartStore((state) => state.clearCart)
  // const checkAuth = useUserStore((state) => state.checkAuth);
  const CartToStore = useOrderStore((state) => state.CartToStore);
  // const handleBuyNow = async() => {

  // if (cart.length === 0) {
  //   toast.error("Your cart is empty. Please add items before proceeding.");
  //   return;
  // }
  // const stripe = await stripePromise;
  // 	const res = await fetch("http://localhost:5000/api/payments/create-checkout-session-bulk", {
  // 		// products: cart,
  //      method: "POST",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // body: JSON.stringify({ products: cart }),
  // 	});
  //   console.log("Checkout session response:", res);
  //   const session = res.data;
  //   console.log("Checkout session response:", session);
  // 	const result = await stripe.redirectToCheckout({
  // 		sessionId: session.id,
  // 	});
  // // Check if the user is logged in
  // const user = useOrderStore.getState().user;
  // if (!user) {
  //   toast.error("You must be logged in to place an order.");
  //   navigate("/login");
  //   return; 
  // }

  // 	if (result.error) {
  // 		console.error("Error:", result.error);
  // 	}
  // // Proceed to the bulk order confirmation page
  // console.log("Navigating to bulk order confirmation with cart:", cart, "and total:", total);
  // // You can also pass the user info if needed
  // //  await useOrderStore.getState().CartToStore(cart);


  //   navigate("/orders/confirm/bulk", { state: { cart, total } });
  // //  const success=await CartToStore(cart);
  // //   console.log("CartToStore returned:", success, "orders now:", useOrderStore.getState().orders);
  // //  if(success){
  // //    console.log("Cart items added to orders successfully");  
  // //  await navigate("/orders/confirm/order-confirmation", { state: { cart, total } });
  // //  } else {
  // //   toast.error("Failed to process order. Please try again.");
  // // }
  // };
  const handleBuyNow = async () => {

    try {
      //  CartToStore(cart);
      // const token = localStorage.getItem("accessToken"); // or get it from your auth store
      const response = await axiosInstance.post('/api/payments/create-checkout-session-bulk', { cart }, { withCredentials: true });
      window.location.href = response.data.url;

      // CartToStore(cart); // Save cart items to order store
      console.log("CartToStore called with cart:", cart);
    } catch (err) {
      console.error('Error redirecting to Stripe', err);
    }
  };

  return (
    <motion.div
      className="mt-6 w-full flex-col lg:mt-0 lg:w-[900px] bg-gray-800 p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-6">
        <span>Total:</span>
        <span className="font-bold">{total.toFixed(2)}</span>
      </div>
      <button
        onClick={handleBuyNow}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Buy Now
      </button>
    </motion.div>
  );
}
