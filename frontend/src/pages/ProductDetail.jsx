import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { fetchProductByid } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductByid(productId);
        if (!data) {
          setError("Product not found");
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError(err.message || "Error loading product");
        setProduct(null);
        toast.error(err.message || "Error loading product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, fetchProductByid]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart");
      return;
    }
    addToCart(product);
    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-white text-xl">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-white">
        Product not found.
      </div>
    );
  }
    const handleBuyNow= (e) => {
      console.log("user", user);
          e.stopPropagation();
      if (!user) {
        toast.error("Please login to place order", { id: "login" });
        return;
      } else {
        navigate(`/orders/confirm/${product._id}`)
        // add to cart
        // addorder(product);
      }
    };


  return (
    // <div className="max-w-8xl mx-auto my-10 p-6 rounded-lg border border-gray-700 shadow-lg text-white h-300">
    //   <div className="flex flex-col md:flex-row gap-8 justify-items-end w-1/2 md:w-1/2">
    //     <div className="w-200 md:w-200 mt-1 h-50 flex justify-left items-left  p-3 ">
    //     <img
    //       src={product.image}
    //       alt={product.name || "Product image"}
    //       className="w-180  object-cover rounded-lg h-120 bg-gray-400 p-1 shadow-lg"
    //     />
    //     </div>
        
    //            <div className="flex items-center gap-4 flex-col col-1 md:flex-col justify-center w-70 md:w-70">
    //       <button
    //         onClick={handleAddToCart}
    //         className="flex items-center W-1/2 justify-center rounded-lg bg-blue-600 px-8 py-3 text-white text-lg hover:bg-blue-700 transition"
    //       >
    //         <ShoppingCart size={24} className="mr-3" />
    //         Add to Cart
    //       </button>
    //         <button
    //         onClick={handleBuyNow}
    //         className="flex items-center W-full justify-center rounded-lg bg-blue-600 px-8 py-3 text-white text-lg hover:bg-blue-700 transition"
    //       >
    //         <ShoppingCart size={24} className="mr-3" />
    //         buy now
    //       </button>
    //       </div></div>
    //     <br />
    //     <div>
    //     <div className="flex flex-col justify-between ml-80 md:ml-80 pl-20 w-100" >
    //       <div>
    //         <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
    //         <p className="text-lg mb-6">{product.description || "No description available."}</p>
    //         <p className="text-3xl font-semibold text-blue-400 mb-6">${product.price}</p>
    //       </div>
   
    //     </div>
    //   </div>
    // </div><div className="max-w-7xl mx-auto px-4 py-10 text-white">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    {/* Product Image */}
    <div className="col-span-1 flex justify-center w-60 md:w-80 ml-5 items-start">
      <img
        src={product.image}
        alt={product.name}
        className="rounded-lg object-contain h-[400px] w-90 bg-gray-200"
      />
    </div>

    {/* Product Details */}
    <div className="col-span-2 space-y-6">
      <h1 className="text-6xl font-bold   text-white">
        <span>
        {product.name}</span></h1>
      <p className="text-3xl text-gray-300">
        <span>{product.description || "No description available."}</span></p>

      <div className="text-3xl font-bold text-yellow-400">₹{product.price}</div>

      {/* Delivery + Stock (Optional) */}
      <p className="text-green-400">In Stock</p>
      <p className="text-sm text-gray-400">Eligible for FREE Shipping</p>
    </div>

    {/* Purchase Box (Amazon-style) */}
    <div className="md:col-span-1 w-full  rounded-lg p-6  ml-5  h-fit space-y-4">
     
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-700 hover:bg-blue-600 text-black font-semibold py-2 rounded transition"
      >
        Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
      >
        Buy Now
      </button>
    </div>
  </div>


  );
};

export default ProductDetail;
