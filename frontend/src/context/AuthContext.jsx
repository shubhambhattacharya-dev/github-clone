import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const logout = async () => {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "GET",
				credentials: "include"
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data?.message || "Failed to logout");
			}

			setAuthUser(null);
			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error?.message || "Logout failed");
		}
	};

	useEffect(() => {
		const checkUserLoggedIn = async () => {
			try {
				const res = await fetch("/api/auth/check", { credentials: "include" });
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data?.error || "Failed to check authentication status");
				}

				setAuthUser(data.user || null); // Set user or fallback to null
			} catch (error) {
				toast.error(error?.message || "Authentication check failed"); // Safe default
				setAuthUser(null); // Fallback
			} finally {
				setLoading(false); // Always stop loading
			}
		};

		checkUserLoggedIn();
	}, []);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser, loading, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
