import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
const Product = () => {

const { fetchAllProducts,products } = useProductStore();
    console.log("products", products);


    
	useEffect(() => {
		fetchAllProducts();
	}, []);
	return (
		<motion.div
			className='shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className='p-4 flex flex-wrap gap-6 justify-start'>
	{products?.map((product) => (
        <ProductCard key={product._id} product={product} />
    ))}
	</div>
				
		</motion.div>
	);
};
export default Product;