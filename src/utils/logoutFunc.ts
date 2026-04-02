// import { logout } from "@/src/redux/features/Auth/authSlice";
// import { AppDispatch, persistor } from "@/src/redux/store";
// import toast from "react-hot-toast";

import { logout } from "@/src/redux/features/Auth/authSlice";
import { AppDispatch, persistor } from "@/src/redux/store";
import toast from "react-hot-toast";

// export const handleLogout = async (
//   dispatch: AppDispatch,
//   isSessionExpired: boolean,
//   router?: any,
// ): Promise<void> => {
//   try {
//   const res =  await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`, {
//       method: "POST",
//       credentials: "include",
//   });
// if (!res.ok) {
// 		throw new Error(`Logout API failed with status ${res.status}`);
// 	}
// } catch (error) {
// 	  // API fail হলেও logout continue করবে
// 	  toast.error("Logout failed. Please try again.");
//     console.error("Logout API error:", error);
//   } finally {
//     // ✅ সবসময় এগুলো run হবে, API fail হলেও
//     dispatch(logout());
//     await persistor.purge();  // ✅ flush → purge
//     localStorage.removeItem("persist:auth");

//     if (isSessionExpired) {
//       toast.error("Session expired. Please log in again.");
//     } else {
//       toast.success("Logged out successfully.");
//     }

//     if (router) {
//       router.push("/login");
//     } else {
//       window.location.href = "/login";
//     }
//   }
// };


export const handleLogout = async (
  dispatch: AppDispatch,
  isSessionExpired: boolean = false,
  router?: any,
): Promise<void> => {

  const callLogoutApi = async () => {
    try {
      // ✅ Next.js proxy route call করো
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const clearLocalState = async () => {
    dispatch(logout());
    await persistor.purge();
    localStorage.removeItem("persist:auth");
  };

  const redirectToLogin = () => {
    if (router) router.push("/login");
    else window.location.href = "/login";
  };

  if (isSessionExpired) {
    toast.error("Session expired. Please log in again.");
    await clearLocalState();
    await callLogoutApi();
    redirectToLogin();
    return;
  }

  const toastId = toast.loading("Logging out...");
  await callLogoutApi();
  await clearLocalState();
  toast.dismiss(toastId);
  toast.success("Logged out successfully.");
  redirectToLogin();
};
// ```

// ---

// ## Summary — কে কোথা থেকে কোনটা Call করে
// ```
// Login Page         → useLoginMutation()     → /api/auth/login
// Logout Button      → useLogoutMutation()    → /api/auth/logout
//                    অথবা handleLogout()      → /api/auth/logout
// Token Expire হলে  → baseApi automatically  → /api/auth/refresh-token
