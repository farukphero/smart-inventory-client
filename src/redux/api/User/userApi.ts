import { baseApi } from "@/src/redux/api/baseApi";



const userApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		signup: build.mutation({
			query: (info) => ({
				url: "/users/register",
				method: "POST",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),
		login: build.mutation({
			query: (info) => ({
				url: "/auth/login",
				method: "POST",
				body: info,
				// credentials: "include",
			}),
			invalidatesTags: ["user"],
		}),

        getSingleUser: build.query({
			query: () => ({
				url: `/users/singleUser`,
				method: "GET",
			}),
			providesTags: ["user"],
		}),
        updateUserDetails: build.mutation({
			query: ({id,info}) => ({
				url: `/users/${id}`,
				method: "PUT",
				body: info,

			}),
			invalidatesTags: ["user"],
        }),
        sendOtpForEmailVerification: build.mutation({
			query: (info) => ({
				url: "/users/send-email-verify-code",
				method: "PUT",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),
		verifyEmailOtp: build.mutation({
			query: (info) => ({
				url: "/users/verify-email-otp",
				method: "PUT",
				body: info,
			}),
			invalidatesTags: ["user"],
		}),

	}),
});

export const {
	useSignupMutation,
	useLoginMutation,
	useGetSingleUserQuery,
	useUpdateUserDetailsMutation,
	useSendOtpForEmailVerificationMutation,
	useVerifyEmailOtpMutation,

} = userApi;
