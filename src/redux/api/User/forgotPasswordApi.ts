import { baseApi } from "../baseApi";

const forgotPasswordApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		sendOtpForVerification: build.mutation({
			query: (info) => ({
				url: "/auth/send-verify-code",
				method: "PUT",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),
		verifyOtp: build.mutation({
			query: (info) => ({
				url: "/auth/verify-otp",
				method: "PUT",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),
		setForgotPassword: build.mutation({
			query: (info) => ({
				url: "/auth/set-password",
				method: "PUT",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),
		changePasswordFromDashboard: build.mutation({
			query: (info) => ({
				url: "/auth/change-password",
				method: "POST",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),
	}),
});

export const {
	useSendOtpForVerificationMutation,
	useVerifyOtpMutation,
	useSetForgotPasswordMutation,
	useChangePasswordFromDashboardMutation
} = forgotPasswordApi;
