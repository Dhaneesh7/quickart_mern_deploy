import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { useUserStore } from "../store/useUserStore";
// import PeopleAlsoBought from "../components/PeopleAlsoBought";
// import OrderSummary from "../components/OrderSummary";
// import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = (id, theme) => {
	const user = useUserStore((state) => state.user);
	// This effect can be used to fetch cart items or perform any side effects		)
	const { cart, getCartItems, total } = useCartStore();

	useEffect(() => {
		if (!user) {
			console.error("User not found, redirecting to login");
			return;
		}
		getCartItems();
	}, [getCartItems]);
	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0 '>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 '>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl '
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-6  flex flex-col '>
								{cart.map((item) => (
									<CartItem key={item._id} item={item} theme={theme} />
								))}

								<div className='mt-6 flex items-right  font-bold justify-end border-t pt-4'>
									Total : {total}
								</div>
							</div>
						)}

					</motion.div>


				</div>
				<br />
				{cart.length > 0 && (
					<motion.div
						className='mx-auto mt-6 max-w-4xl space-y-6 lg:mt-0 lg:w-full'
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<OrderSummary />
						{/* <GiftCouponCard />  */}
					</motion.div>
				)}
			</div>
		</div>
	);
};
export default CartPage;

const EmptyCartUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-4 py-16'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<ShoppingCart className='h-24 w-24 text-gray-300' />
		<h3 className='text-2xl font-semibold '>Your cart is empty</h3>
		<p className='text-gray-400'>Looks like you {"haven't"} added anything to your cart yet.</p>
		<Link
			className='mt-4 rounded-md bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600'
			to='/productlist'
		>
			Start Shopping
		</Link>
	</motion.div>
);