import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
const LoginPage = ({theme}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
const navigate = useNavigate();
const login = useUserStore((state) => state.login);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(email, password);
		const success=await login(email, password);
		if (success) {
			console.log("Login successfull");
		navigate("/productlist");	
			
		}
	};

	return (
		<div className='flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='mx-auto w-full max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-blue-400'>Login to your account</h2>
			</motion.div>

			<motion.div
				className='mt-8 mx-auto w-full max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className={` py-8 px-4 shadow sm:rounded-lg sm:px-10 max-w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
					<form  className='space-y-6 px-2 ' onSubmit={handleSubmit}>
						<div>
							<label htmlFor='email' className={`block text-sm font-medium ${theme === 'dark'?'text-gray-300' : 'text-gray-800'}`}>
								Email address
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={`block w-full px-3 py-2 pl-10 ${theme === 'dark'?'bg-gray-700 border border-gray-600  placeholder-gray-400 ':'bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-600 '} 
									rounded-md shadow-sm
								focus:outline-none focus:ring-blue-500 
									 focus:border-blue-500 sm:text-sm`}
									placeholder='you@example.com'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='password' className={`block text-sm font-medium ${theme === 'dark'?'text-gray-300' : 'text-gray-800'}`}>
								Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className={`block w-full px-3 py-2 pl-10 ${theme === 'dark'?'bg-gray-700 border border-gray-600  placeholder-gray-400 ':'bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-600 '} 
									rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
									placeholder='••••••••'
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
							 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50'
						
						>
						
							
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							
						</button>
					</form>

					<p className={`mt-8 text-center text-sm  ${theme === 'dark'?'text-gray-300' : 'text-gray-800'}`}>
						Not a member?{" "}
						<Link to='/signup' className='font-medium text-blue-400 hover:text-blue-300'>
							Sign up now <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default LoginPage;