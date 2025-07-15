import { Link } from "react-router-dom";
import { useOrderStore } from "../store/useOrderStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import OrderItem from "../components/OrderItem";
import { useUserStore } from "../store/useUserStore";
// import PeopleAlsoBought from "../components/PeopleAlsoBought";
// import OrderSummary from "../components/OrderSummary";
// import GiftCouponCard from "../components/GiftCouponCard";

const Orders = (theme) => {

    // This effect can be used to fetch cart items or perform any side effects		)
    const {orders,fetchOrders} = useOrderStore();
const user = useUserStore((state) => state.user);
    useEffect(() => {
if (!user) {
            console.error("User not found, redirecting to login");
            return;
        }
        
        fetchOrders();
    },[fetchOrders] );
    //  console.log("Fetched orders:", orders);
    return (
        <div className='py-8 md:py-16'>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0  overflow-x-hidden '>
                <div className='mt-6'>
                    <motion.div
                        className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl '
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {orders.length === 0 ? (
                            <EmptyOrderUI />
                        ) : (
                            <div className='space-y-6 flex flex-col justify-center '>
                               { console.log("orders", orders)}
                                {orders.filter(item => item.product)
                                .map((item,index) => (
                                    <OrderItem key={item._id||`order-${index}`} item={item} theme={theme}/>
                                    
                                ))}

                                <div className='mt-6 flex items-right  font-bold justify-end border-t pt-4'>
                        {/* Total : {total} */}
                                    </div>
                            </div>
                        )}
                        
                    </motion.div>

                    {orders.length > 0 && (
                        <motion.div
                            className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            {/* <OrderSummary />
                            <GiftCouponCard /> */}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Orders;

const EmptyOrderUI = () => (
    <motion.div
        className='flex flex-col items-center justify-center space-y-4 py-16'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <ShoppingCart className='h-24 w-24 text-gray-300' />
        <h3 className='text-2xl font-semibold'>Your orders is empty</h3>
        <p className='text-gray-400'>Looks like you {"haven't"} purchased anything  yet.</p>
        <Link
            className='mt-4 rounded-md bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600'
            to='/productlist'
        >
            Start Shopping
        </Link>
    </motion.div>
);