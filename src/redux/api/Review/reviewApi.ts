import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addReview: build.mutation({
			query: (info) => ({
				url: "/review/create",
				method: "POST",
				body: info,
			}),
		}),
	}),
});

export const { useAddReviewMutation } = reviewApi;
