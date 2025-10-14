import { useState } from "react";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { handleLoginWithGithub } from "../lib/function";

const LoginPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: ""
	});

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isLogin) {
			// Handle login logic - redirect to GitHub OAuth
			handleLoginWithGithub();
		} else {
			// Handle signup logic - redirect to GitHub OAuth
			if (formData.password !== formData.confirmPassword) {
				alert("Passwords don't match!");
				return;
			}
			handleLoginWithGithub();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
			<div className="max-w-md w-full">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
						<FaGithub className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Welcome to GitHub Clone</h1>
					<p className="text-gray-400">Connect, collaborate, and code together</p>
				</div>

				{/* Auth Card */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
					{/* Toggle */}
					<div className="flex rounded-lg bg-gray-800/50 p-1 mb-6">
						<button
							onClick={() => setIsLogin(true)}
							className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
								isLogin
									? "bg-blue-600 text-white shadow-lg"
									: "text-gray-400 hover:text-white"
							}`}
						>
							Sign In
						</button>
						<button
							onClick={() => setIsLogin(false)}
							className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
								!isLogin
									? "bg-blue-600 text-white shadow-lg"
									: "text-gray-400 hover:text-white"
							}`}
						>
							Sign Up
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name field for signup */}
						{!isLogin && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Full Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
									placeholder="Enter your full name"
									required={!isLogin}
								/>
							</div>
						)}

						{/* Email field */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Email Address
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
								placeholder="Enter your email"
								required
							/>
						</div>

						{/* Password field */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 pr-12"
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
								>
									{showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* Confirm Password for signup */}
						{!isLogin && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Confirm Password
								</label>
								<input
									type="password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
									placeholder="Confirm your password"
									required={!isLogin}
								/>
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
						>
							{isLogin ? "Sign In" : "Create Account"}
						</button>
					</form>

					{/* Divider */}
					<div className="flex items-center my-6">
						<div className="flex-1 border-t border-gray-600"></div>
						<span className="px-3 text-sm text-gray-400">or</span>
						<div className="flex-1 border-t border-gray-600"></div>
					</div>

					{/* GitHub OAuth */}
					<button
						type="button"
						onClick={handleLoginWithGithub}
						className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3 border border-gray-600 hover:border-gray-500"
					>
						<FaGithub className="w-5 h-5" />
						Continue with GitHub
					</button>

					{/* Terms */}
					{!isLogin && (
						<p className="text-xs text-gray-400 text-center mt-4">
							By creating an account, you agree to our{" "}
							<a href="#" className="text-blue-400 hover:text-blue-300 underline">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="#" className="text-blue-400 hover:text-blue-300 underline">
								Privacy Policy
							</a>
						</p>
					)}
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-gray-400 text-sm">
						{isLogin ? "New to GitHub Clone?" : "Already have an account?"}{" "}
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors"
						>
							{isLogin ? "Create an account" : "Sign in instead"}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;