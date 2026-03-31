import { baseApi } from "@/redux/api/baseApi";

const getAdsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAllAds: build.query({
			query: ({
				page,
				limit,
				searchTerm,
				price,
				condition,
				transactionType,
				category,
				subCategory,
				district,
				id,
			}) => ({
				url: "/ads/posts",
				method: "GET",
				params: {
					page,
					limit,
					searchTerm,
					price,
					condition,
					transactionType,
					category,
					subCategory,
					district,
					id,
				},
			}),
			providesTags: ["ads"],
		}),
		getMyAllAds: build.query({
			query: ({
				page,
				limit,
				searchTerm,
				adsId,
			}) => ({
				url: "/ads/my/posts",
				method: "GET",
				params: {
					page,
					limit,
					searchTerm,
					adsId,
				},
			}),
			providesTags: ["ads"],
		}),
		getTodayAllAds: build.query({
			query: ({ limit }) => ({
				url: "/ads/today-ads",
				method: "GET",
				params: {
					limit,
				},
			}),
			providesTags: ["ads"],
		}),

		getSingleAds: build.query({
			query: (id) => ({
				url: `/ads/${id}`,
				method: "GET",
			}),
			providesTags: ["ads"],
		}),

	}),
});

export const {
	useGetAllAdsQuery,
	useGetMyAllAdsQuery,
	useGetTodayAllAdsQuery,
	useGetSingleAdsQuery,
} = getAdsApi;
