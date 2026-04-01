import { baseApi } from "@/src/redux/api/baseApi";



const productCategoryApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createCategory: build.mutation({
			query: (info) => ({
				url: "/category/create",
				method: "POST",
				body: info,
			}),
			invalidatesTags: ["category"],
		}),
		getAllCategories: build.query({
			query: ({page, limit, searchTerm }) => ({
				url: "/category/get-all",
				method: "GET",
				params: { page, limit, searchTerm },
			}),
			providesTags: ["category"],
		}),
     getSingleCategory: build.query({
			query: (id) => ({
				url: `/category/${id}`,
			}),
			providesTags: ["category"],
	 }),

		updateCategory: build.mutation({
			query: ({ id, ...info }) => ({
				url: `/category/${id}`,
				method: "PATCH",
				body: info,
			}),
			invalidatesTags: [ "category" ],
		}),
		deleteCategory: build.mutation({
			query: (id) => ({
				url: `/category/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [ "category" ],
		}),}),

});

export const {
	useCreateCategoryMutation,
	useGetAllCategoriesQuery,
	useGetSingleCategoryQuery,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
} = productCategoryApi;
