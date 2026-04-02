import { baseApi } from "@/src/redux/api/baseApi";
import { BaseQueryApi, QueryReturnValue } from "@reduxjs/toolkit/query";



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
  queryFn: async (
    info: any,
    api: BaseQueryApi,
    _extraOptions: any,
    _baseQuery: any
  ): Promise<QueryReturnValue<any, any, any>> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(info),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: { status: res.status, data } };
      }

    //   if (data?.data?.accessToken) {
    //     api.dispatch(setUser({ token: data.data.accessToken }));
    //   }

      return { data };
    } catch (error) {
      return { error: { status: "FETCH_ERROR", error: String(error) } };
    }
  },
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
