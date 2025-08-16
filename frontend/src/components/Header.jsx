import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Package, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

const Header = ({ toggleTheme, theme }) => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const { orderItems } = useOrderStore();

  const [isThemeSet, setIsThemeSet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handlelogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
                <Link to="/cart" className="relative hover:text-blue-400">
                  <ShoppingCart size={20} className="inline-block mr-1" />
                  <span className="hidden sm:inline">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {cart.length}
                    </span>
                  )}
                </Link>

                <Link to="/orders" className="relative hover:text-blue-400">
                  <Package size={20} className="inline-block mr-1" />
                  <span className="hidden sm:inline">Orders</span>
                  {orderItems?.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {orderItems.length}
                    </span>
                  )}
                </Link>

                <Link to="/search" className="hover:text-blue-400 flex items-center">
                  <Search size={20} className="mr-1" />
                  <span className="hidden sm:inline">Search</span>
                </Link>

                <ThemeToggle />
              </>
            )}

            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium flex items-center"
              >
                <Lock size={18} className="mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

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
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-row bg-blue-900 text-white px-6 py-4 space-y-4 animate-slideDown">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          {user && (
            <>
              <Link to="/cart" onClick={() => setIsOpen(false)}>Cart ({cart.length})</Link>
              <Link to="/orders" onClick={() => setIsOpen(false)}>Orders ({orderItems?.length || 0})</Link>
              <Link to="/search" onClick={() => setIsOpen(false)}>Search</Link>
              <ThemeToggle />
            </>
          )}
          {isAdmin && (
            <Link to="/secret-dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handlelogout();
              }}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
