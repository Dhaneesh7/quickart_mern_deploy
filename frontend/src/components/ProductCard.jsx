import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ product }) => {
	const  user  = useUserStore(state=> state.user);
	const  addToCart  = useCartStore(state => state.addToCart	);
	const navigate= useNavigate();
	const handleAddToCart = (e) => {
		console.log("user", user);
		    e.stopPropagation();
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(product);
		}
	};
	const handlebuyNow= (e) => {
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

const fullcard = () =>{

	    navigate(`/products/${product._id}`);
}

	  if (!product) {
    return <div>Loading product...</div>; // or return null or a placeholder
  }

	return (
		<div className='flex w-80 relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg cursor-pointer'    onClick={fullcard}
      role="button"
      tabIndex={0}
	   aria-label={`View details for ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter") fullcard();
      }}>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-60 bg-gray-400' src={product.image.startsWith("data:image")
      ? product.image
      : `${import.meta.env.VITE_API_URL}/uploads/${product.image}`} alt='product image' />
				{/* <div className='absolute inset-0 bg-black bg-opacity-20' /> */}
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-blue-400'>₹{product.price}</span>
					</p>
				</div>
				<div className="flex justify-center gap-4 mt-4">
				<button 
				     type="button"
					className='flex items-center justify-left rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to cart
				</button>
					<button 
				     type="button"
					className='flex items-center justify-right rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
					onClick={handlebuyNow}
				>
					{/* <ShoppingCart size={22} className='mr-2' /> */}
					buy now
				</button>
				</div>
			</div>
		</div>
	);
};
export default ProductCard;