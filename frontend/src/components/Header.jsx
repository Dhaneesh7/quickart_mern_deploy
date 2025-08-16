import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Package,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";

const Header = ({ toggleTheme, theme, products = [] }) => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const { orderItems } = useOrderStore();

  const [isThemeSet, setIsThemeSet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Search States
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const searchRef = useRef(null);

  const handlelogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFilteredProducts([]);
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.documentElement.setAttribute("data-theme", defaultTheme);
    }
    setIsThemeSet(true);
  }, []);

  if (!isThemeSet) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-blue-800 ${
        theme === "dark"
          ? " bg-gray-900 bg-opacity-90 text-white"
          : " bg-blue-950 bg-opacity-100 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 items-center space-x-2 flex"
          >
            <ShoppingCart className="text-green-500" />
            Quic<p className="text-green-500">K</p>art
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="hover:text-blue-400">Home</Link>

            {user && (
              <>
                {/* Cart */}
                <Link to="/cart" className="relative hover:text-blue-400">
                  <ShoppingCart size={20} className="inline-block mr-1" />
                  <span className="hidden sm:inline">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {cart.length}
                    </span>
                  )}
                </Link>

                {/* Orders */}
                <Link to="/orders" className="relative hover:text-blue-400">
                  <Package size={20} className="inline-block mr-1" />
                  <span className="hidden sm:inline">Orders</span>
                  {orderItems?.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {orderItems.length}
                    </span>
                  )}
                </Link>

                {/* Search */}
                <div className="relative" ref={searchRef}>
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="hover:text-blue-400 flex items-center"
                  >
                    <Search size={20} className="mr-1" />
                    <span className="hidden sm:inline">Search</span>
                  </button>

                  {showSearch && (
                    <div className="absolute top-10 left-0 bg-white text-black shadow-lg rounded-md p-3 w-72">
                      <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="px-2 py-1 rounded-md border w-full"
                          placeholder="Search products..."
                          autoFocus
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="text-red-500 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </form>

                      {/* Search results */}
                      {filteredProducts.length > 0 && (
                        <div className="mt-2 max-h-60 overflow-y-auto">
                          {filteredProducts.map((p) => (
                            <Link
                              key={p.id}
                              to={`/product/${p.id}`}
                              className="block px-4 py-2 hover:bg-gray-200 rounded"
                              onClick={() => {
                                setShowSearch(false);
                                handleClearSearch();
                              }}
                            >
                              {p.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchTerm && filteredProducts.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">No products found.</p>
                      )}
                    </div>
                  )}
                </div>

                <ThemeToggle />
              </>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium flex items-center"
              >
                <Lock size={18} className="mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <button
                onClick={handlelogout}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <Link
                  to="/about"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  About
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
		  {isOpen && (
  <nav className="md:hidden mt-3 space-y-3 bg-blue-900 text-white rounded-lg shadow-lg p-4">
    <Link to="/" className="block hover:text-blue-400">Home</Link>

    {user && (
      <>
        <Link to="/cart" className="block hover:text-blue-400">
          <ShoppingCart size={20} className="inline-block mr-1" />
          Cart
          {cart.length > 0 && (
            <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
              {cart.length}
            </span>
          )}
        </Link>

        <Link to="/orders" className="block hover:text-blue-400">
          <Package size={20} className="inline-block mr-1" />
          Orders
          {orderItems?.length > 0 && (
            <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
              {orderItems.length}
            </span>
          )}
        </Link>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="block hover:text-blue-400"
        >
          <Search size={20} className="inline-block mr-1" />
          Search
        </button>

        <ThemeToggle />
      </>
    )}

    {isAdmin && (
      <Link
        to="/secret-dashboard"
        className="block bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
      >
        <Lock size={18} className="inline-block mr-1" />
        Dashboard
      </Link>
    )}

    {user ? (
      <button
        onClick={handlelogout}
        className="block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
      >
        <LogOut size={18} className="inline-block mr-1" />
        Log Out
      </button>
    ) : (
      <>
        <Link
          to="/signup"
          className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          <UserPlus size={18} className="inline-block mr-2" />
          Sign Up
        </Link>
        <Link
          to="/login"
          className="block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
        >
          <LogIn size={18} className="inline-block mr-2" />
          Login
        </Link>
        <button
          onClick={toggleTheme}
          className="block w-full mt-2 px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <Link
          to="/about"
          className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-2"
        >
          About
        </Link>
      </>
    )}
  </nav>
)}

        </div>
      </div>
    </header>
  );
};

export default Header;
