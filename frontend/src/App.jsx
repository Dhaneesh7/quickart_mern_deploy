import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useUserStore } from './store/useUserStore'
import { useCartStore } from './store/useCartStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import AdminPage from './pages/AdminPage'
import ProductsList from './components/ProductList'
import ProductCard from './components/ProductCard'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import PlaceOrderPage from './pages/OrderPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import Orders from './pages/Orders'
import { useThemeStore } from './store/useThemeStore'
import Search from './pages/Search'
import About from './pages/About'
import Footer from './components/Footer'
import BulkOrderPage from './pages/BulkOrder'
import axiosInstance from './lib/axios'
import { useRef } from 'react'
function App() {
	const called = useRef(false);
	const { user, checkAuth, checkingAuth,setuserById } = useUserStore();
	const { getCartItems } = useCartStore();
	//   const [theme, setTheme] = useState('dark')
	   const { theme, toggleTheme } = useThemeStore();

  // Toggle theme handler
//   const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Sync theme with <html> class on mount and on theme change
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		 console.log("🧠 checkingAuth:", checkingAuth);
  console.log("👤 user:", user);
  console.log("user id:", user ? user.id : "No user logged in");
		if (!user|| checkingAuth || called.current) return;
		called.current = true; // Prevents multiple calls
		console.log("🛒 Fetching user by ID:", user.id);
setuserById(user.id);
  console.log("🛒 Fetching cart items...");
		getCartItems();
	}, [getCartItems, user,checkingAuth]);
	  if (checkingAuth) {
    return <div>Loading...</div>; // or a spinner
  }

axiosInstance.defaults.baseURL = 'http://localhost:5000';
axiosInstance.defaults.withCredentials = true; // ✅ Important for sending cookies

  return (
    <>
 		{/* <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'> */}
		  <div
                className={`min-h-screen relative overflow-hidden
                    ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-900 text-white'}`
                }
            >
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					 <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full  ${theme === 'dark' 
                       ? 'bg-[radial-gradient(ellipse_at_top,rgba(59, 131, 246, 0.47)_0%,rgba(29, 79, 216, 0.4)_45%,rgba(0, 0, 0, 0.37)_100%)]' 
                       : 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3)_0%,rgba(29,78,216,0.2)_45%,rgba(0,0,0,0.1)_100%)]'
                     }`}
					 
        // bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3)_0%,rgba(29,78,216,0.2)_45%,rgba(0,0,0,0.1)_100%)]
        //         dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.5)_0%,rgba(29,78,216,0.4)_45%,rgba(0,0,0,0.4)_100%)]' 
      /></div>
			</div>

			<div className='relative z-50 pt-20'>
		<Header toggleTheme={toggleTheme} theme={theme} />

  <main className="flex-col items-center justify-center min-h-screen">
      	<Routes>

					<Route path='/' element={<Home />} />
					<Route path='/signup' element={!user ? <SignUpPage theme={theme}/> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage theme={theme} /> : <Navigate to='/' />} />
					<Route
						path='/secret-dashboard'
						element={<AdminPage /> }
					/>
					<Route path='/category/:category' element={<CategoryPage />} />
					<Route path='/cart' element={user ? <CartPage theme={theme}/> : <Navigate to='/login' />} />
					<Route path='/products/:productId' element={ <ProductDetail/> } />
					<Route path='/productlist' element={ <Product/> } />
					<Route path='/orders/confirm/:product' element={ <PlaceOrderPage /> } />
					<Route path='/orders/confirm' element={ <OrderConfirmationPage/> } />
					<Route path='/orders/confirm/bulk' element={<BulkOrderPage/>} />
					<Route path='/orders' element={<Orders theme={theme}/>} />
					<Route path='/search' element={<Search />} />
					<Route path='/about' element={<About />} />
					
				</Routes>
				</main>
				<Footer theme={theme} toggleTheme={toggleTheme} />
		
			<Toaster />
			</div>
		</div>
    </>
  )
}

export default App
