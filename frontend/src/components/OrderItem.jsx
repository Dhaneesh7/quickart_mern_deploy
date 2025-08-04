import { Trash } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";

const OrderItem = ({ item ,theme}) => {
  // const OrderItem = useOrderStore((state) => state.OrderItem);
  const removeOrderItem = useOrderStore((state) => state.removeOrderItem);
  // const product=item.product;
    const product = item?.product;
  if (!product) {
    return (
      <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 text-red-400">
        ⚠️ Product details not available for this order.
      </div>
    );
  }
  	const removeItem = (e) => {
		e.stopPropagation(); // Prevent the click from bubbling up to the parent div
		removeOrderItem(item._id);
	};
  // console.log("OrderItem:", item);
  // console.log("OrderItem product:", item.product);
  // console.log("OrderItem product:", item.product.name);
  return (
    <div className={`rounded-lg border p-4 shadow-sm  border-gray-700 md:p-6 `}>
      <div className='space-y-4 ml-30 md:flex md:items-center  md:justify-between md:gap-6 md:space-y-0'>
        <div className='shrink-0 md:order-1'>
          <img className='h-20 md:h-32 rounded object-cover bg-gray-400' loading="lazy" src={product.image} alt={product.name} />
        </div>

        <div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
          <p className='text-base font-medium text-white hover:text-white-400 hover:underline'>
            {product.name}
          </p>
          <p className='text-sm text-gray-400'>{product.description}</p>
        </div>

        <div className='text-end md:order-3 md:w-32'>
          <p className='text-base font-bold text-gray-400'>₹{product.price}</p>
        </div>
        {console.log("product.quntity:", item.quantity)}
    <div className='text-end md:order-3 md:w-32'>
          <p className='text-base font-bold text-gray-400'>qty :- {item.quantity}</p>
        </div>
        <div className='md:order-4'>
          <button
            aria-label="Remove item"
  title="Remove item"
            className='inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline'
            onClick={ removeItem}
          >
            <Trash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
