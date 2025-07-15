import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
const CartItem = ({ item ,theme}) => {
	const { removeFromCart,updateQuantity} = useCartStore();
	const navigate = useNavigate();
	console.log("item", item);
	
const quantitydown = (e) => {
		e.stopPropagation(); // Prevent the click from bubbling up to the parent div
		if (item.quantity > 1) {
			updateQuantity(item._id, item.quantity - 1);
		} else {
			removeFromCart(item._id);
		}
	};
	const quantityup = (e) => {
		e.stopPropagation(); // Prevent the click from bubbling up to the parent div
		updateQuantity(item._id, item.quantity + 1);
	};
	const removeItem = (e) => {
		e.stopPropagation(); // Prevent the click from bubbling up to the parent div
		removeFromCart(item._id);
	};

const handleclick = (e) => {
	e.stopPropagation(); // Prevent the click from bubbling up to the parent div
		console.log("Item clicked:", item);
		navigate(`/products/${item._id}`);
}
	return (
	<div
      className={`rounded-lg border p-4 shadow-sm ml-20 border-gray-700 md:p-6 ${
        theme === "dark"
          ? "text-white"
          : " text-gray-800"
      }`}
      onClick={handleclick}
    >
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className=" w- 60 h-80 justify-center items-center">
          <img
            className="h-20 md:h-80 h-80 w-60 rounded object-cover bg-gray-400"
				loading='lazy'
            src={item.image}
            alt={item.name}
          />
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-white-400 hover:underline">
            {item.name}
          </p>
          <p className="text-sm text-gray-400">{item.description}</p>
        </div>

        <div className="text-end md:order-3 md:w-32">
          <p className="text-base font-bold text-gray-400">
            Price: ₹{item.price}
          </p>
        </div>

        <div className="text-end md:order-3 md:w-32">
          <p className="text-base font-bold text-gray-400">
            Qty: {item.quantity}
          </p>
        </div>

        <div className="md:order-4 flex items-center gap-3">
          <button
            onClick={quantitydown}
            className="inline-flex items-center justify-center w-6 h-6 rounded border border-gray-500 hover:bg-gray-600 text-white"
            title="Decrease Quantity"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={quantityup}
            className="inline-flex items-center justify-center w-6 h-6 rounded border border-gray-500 hover:bg-gray-600 text-white"
            title="Increase Quantity"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={removeItem}
            className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
            title="Remove item"
          >
            <Trash />
          </button>
        </div>
      </div>
    </div>
	);
};
export default CartItem;