import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const PlaceOrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false); // local loading state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/products/${productId}`);
        setProductData(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [productId]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit order → Stripe redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/api/orders/create-checkout-session`, {
      productId,
  productName: productData.name,   // ✅ send actual product name
  unitPriceRupees: productData.price, // ✅ send price
  quantity: 1,
  name: formData.name,             // user’s name (separate)
  email: formData.email,
  phone: formData.phone,
  address: formData.address,
      });

      const { sessionId } = data;
      if (!sessionId) {
        console.error("No sessionId from backend:", data);
        toast.error("Failed to start payment");
        return;
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      console.error("Stripe Checkout error:", error);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!productData) {
    return <p className="text-center text-gray-600 mt-8">Loading product...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Place Your Order</h2>

      {/* ✅ Product Info */}
      <div className="border rounded-lg p-4 mb-6 shadow-sm bg-white">
        <h3 className="text-lg font-semibold">{productData.name}</h3>
        <p className="text-gray-600">₹{productData.price}</p>
      </div>

      {/* ✅ Checkout Form */}
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-6 shadow-sm bg-white space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows="3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrderPage;
