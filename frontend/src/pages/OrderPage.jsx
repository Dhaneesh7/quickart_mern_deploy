import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, number } from "framer-motion";
import { Loader, User, Mail, Phone } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import axiosInstance from "../lib/axios";
const PlaceOrderPage = () => {
  const { product } = useParams();
  const [productData, setProductData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    product: "",
    quantity: 1,
  });

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`https://quickart-mern-deploy.onrender.com/api/products/id/${product}`);
      const data = await res.json();
      setProductData(data);
    }
    fetchProduct();
  }, [product]);

  const navigate = useNavigate();
  const { addOrder, loading } = useOrderStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      unitPriceRupees: productData.price,
      productId: productData._id,
      name: productData.name,  // product comes from useParams as a string product id
    };
    //     await setFormData((prev) => ({
    //   ...prev,
    //   product: product._id,
    //   price: product.price,
    //   // productId: product._id,
    // }));
    // old one without stripe
    // console.log("formData", orderData);
    // const success = await addOrder(orderData);
    // if (success) {
    //   setFormData({
    //     name: "",
    //     email: "",
    //     phone: "",
    //     address: "",
    //     quantity: 1,
    //   });
    // }
    //   navigate("/orders/confirm/order-confirmation");
    // }
    //with stripe
    try {
      // const res = await fetch("https://quickart-mern-deploy.onrender.com/api/payments/create-checkout-session", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include", // ✅ include cookies
      //   body: JSON.stringify(orderData),
      // });
      // if (!res.ok) {
      //   const errText = await res.text();
      //   console.error("Failed to create checkout session:", res.status, errText);
      //   return;
      // }
const res = await axiosInstance.post("https://quickart-mern-deploy.onrender.com/api/payments/create-checkout-session", orderData)
      const data = await res.json();
      // const data = res.data;
      //  const res = await fetch("https://quickart-mern-deploy.onrender.com/api/payments/create-checkout-session", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //    credentials: "include", // ✅ include cookies
    //   body: JSON.stringify(orderData),
    // });
    //     if (!res.ok) {
    //   const errText = await res.text();
    //   console.error("Failed to create checkout session:", res.status, errText);
    //   return;
    // }

    // const data = await res.json();
      console.log("Checkout session created:", data);

      const stripe = await loadStripe("pk_test_51RaWhqH9FCrDK0ULWAYDWcJzMJ5CWZuoUAXLgCR6KpPARhq3xNAtrbTuIyHpCW9yqhN9taojvfeSYGgyiysifzJK00dgL2QG55");
      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error("Stripe Checkout error", err);
    }
  };

  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='text-center text-3xl font-extrabold text-blue-400'>Place Your Order</h2>
      </motion.div>

      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Name */}
            <InputField
              id='name'
              label='Full Name'
              icon={<User />}
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='John Doe'
            />
            {/* Email */}
            <InputField
              id='email'
              label='Email Address'
              icon={<Mail />}
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder='you@example.com'
            />
            {/* Phone */}
            <InputField
              id='phone'
              label='Phone'
              icon={<Phone />}
              type='tel'
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder='123-456-7890'
            />
            {/* Address */}
            <InputField
              id='address'
              label='Shipping Address'
              icon={<User />}
              type='text'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder='123 Main St, City'
            />
            {/* Product
            <div>
              <label className='block text-sm font-medium text-gray-300'>Product</label>
              <select
                value={formData.product}
                required
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className='mt-1 block w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-md'
              >
                <option value=''>Select a product</option>
                <option value='Product A'>Product A</option>
                <option value='Product B'>Product B</option>
              </select>
            </div> */}
            {/* Quantity */}
            <div>
              <label className='block text-sm font-medium text-gray-300'>Quantity</label>
              <input
                type='number'
                min='1'
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className='mt-1 block w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-md'
              />
            </div>
            {/* Submit */}
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className='animate-spin mr-2' /> Placing Order...
                </>
              ) : (
                "Confirm Order"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ id, label, icon, type, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className='block text-sm font-medium text-gray-300'>{label}</label>
    <div className='mt-1 relative rounded-md shadow-sm'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>{icon}</div>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white'
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default PlaceOrderPage;
