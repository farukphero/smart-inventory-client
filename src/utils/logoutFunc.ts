import { logout } from "@/src/redux/features/Auth/authSlice";
import { AppDispatch, persistor } from "@/src/redux/store";
import toast from "react-hot-toast";


export const handleLogout = async (
	dispatch: AppDispatch,
	isSessionExpired: boolean,
	router?: any,
): Promise<void> => {
	try {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});

		// Remove from Redux
		dispatch(logout());
		// Flush persisted storage to clear Redux state
		await persistor.flush();
		localStorage.removeItem("persist:auth");

		// Show appropriate logout message based on the event
	 // Use the toast helper
		if (isSessionExpired) {
		 toast.error("Search session expired. Please log in again.");


		} else {
			toast.success("Logged out successfully.");
		}

		if (router) {
			router.push("/login");
		} else {
			window.location.href = "/login"; // Fallback
		}
	} catch (error) {
		 toast.error("An error occurred during logout. Please try again.");
		console.error("Logout error:", error);

	}
};
