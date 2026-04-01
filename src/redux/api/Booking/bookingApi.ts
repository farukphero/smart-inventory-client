import { baseApi } from "@/src/redux/api/baseApi";



const adsPostApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createBooking: build.mutation({
			query: (info) => ({
				url: "/booking/create",
				method: "POST",
				body: info,
			}),
			invalidatesTags: ["booking"],
		}),

		getAllBooking: build.query({
			query: ({ adsId }) => ({
				url: "/booking/bookings",
				method: "GET",
				params: {
					adsId,
				},
			}),
			providesTags: ["booking"],
		}),
	}),
});

export const { useCreateBookingMutation, useGetAllBookingQuery } = adsPostApi;
