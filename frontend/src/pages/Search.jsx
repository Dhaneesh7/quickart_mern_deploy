import { useState } from "react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";
const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {products}= useProductStore();
    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleSearch = () => {
        // Logic for handling search can be added here
   const  filtered =   products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
        setFilteredProducts(filtered);
   
    };
    const handleclearSearch = () => {
        setSearchTerm("");
        setFilteredProducts([]);
    };
  return (
    <div>
    <div className="items-left justify-left ">
      <input type="text" placeholder="Search for products..." className="p-2 border border-gray-300 rounded-md text-gray-700 w-140 " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={handleSearch}>
            Search  </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-300 transition-colors ml-4" onClick={handleclearSearch}>
            Clear Search
        </button>
    </div>
    <div className="mt-4">
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        ) : (
            <p className="text-gray-500">No products found.</p>
        )}
        </div>
        </div>

  );
}
export default Search;