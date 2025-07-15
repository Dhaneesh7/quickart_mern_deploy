import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Package, Search } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

const Header = ({toggleTheme,theme}) => {
	const { user, logout } = useUserStore();
	const navigate = useNavigate();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const { orderItems } = useOrderStore(); // Optional: for showing number of orders

  const [isThemeSet, setIsThemeSet] = useState(false);

  const handlelogout = async () => {
	try {	
		await logout();
		 navigate("/login");
	} catch (error) {
		console.error("Logout error:", error);
	}
  };
    useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
    setIsThemeSet(true);
  }, []);

  if (!isThemeSet) {
    return null; // Prevent rendering until the theme is set
  }
	return (
		<header className={`fixed top-0 left-0 w-full backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-blue-800 ${theme === 'dark' ? ' bg-gray-900 bg-opacity-90 text-white' : ' bg-blue-950 bg-opacity-100 text-white'}`}>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-blue-400 items-center space-x-2 flex'>
						<ShoppingCart className="text-green-500"/>Quic<p className="text-green-500">K</p>art 
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out'
						>
							Home
						</Link>

						{user && (
							<>
								{/* Cart */}
								<Link
									to={"/cart"}
									className='relative group text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out'
								>
									<ShoppingCart className='inline-block mr-1' size={20} />
									<span className='hidden sm:inline'>Cart</span>
									{cart.length > 0 && (
										<span className='absolute -top-2 -left-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs'>
											{cart.length}
										</span>
									)}
								</Link>

								{/* Orders */}
								<Link
									to={"/orders"}
									className='relative group text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out'
								>
									<Package className='inline-block mr-1' size={20} />
									<span className='hidden sm:inline'>Orders</span>
									{orderItems?.length > 0 && (
										<span className='absolute -top-2 -left-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs'>
											{orderItems.length}
										</span>
									)}
								</Link>
								<Link
									to={"/search"}
									className='relative group text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out'
								>
									  <Search className='inline-block mr-1' size={20} />
									<span className='hidden sm:inline'>Search</span>
								
								</Link>
								<ThemeToggle/>
							</>
						)}

						{/* Admin Dashboard */}
						{isAdmin && (
							<Link
								to={"/secret-dashboard"}
								className='bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium flex items-center'
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{/* Auth Buttons */}
						{user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								onClick={handlelogout}
								
							>
								
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
								
							</button>
								// <Link
								// 	to={"/login"}
								// 	className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								// >
								// 	<LogOut className='mr-2' size={18} />
								// 	Logout
								// </Link>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
								   <button onClick={toggleTheme}
        className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        aria-label="Toggle light/dark mode"
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
	  	<Link
									to={"/about"}
									className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								>
									About
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
