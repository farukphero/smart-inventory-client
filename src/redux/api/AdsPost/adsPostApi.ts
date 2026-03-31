import { baseApi } from "@/redux/api/baseApi";

const adsPostApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createPost: build.mutation({
			query: (info) => ({
				url: "/ads/create",
				method: "POST",
				body: info,
			}),
			invalidatesTags: ["ads"],
		}),
		updateViewsOrSavedAds: build.mutation({
			query: ({id, info}) => ({
				url: `/ads/${id}`,
				method: "PUT",
				body: info,
			}),
			invalidatesTags: ["ads"],
		}),
	}),

});

export const {
	useCreatePostMutation,
	useUpdateViewsOrSavedAdsMutation
} = adsPostApi;
