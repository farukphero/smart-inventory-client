import { baseApi } from "@/src/redux/api/baseApi";



const productsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createProduct: build.mutation({
			query: (info) => ({
				url: "/products/create",
				method: "POST",
				body: info,
			}),
			invalidatesTags: ["product"],
		}),
		getAllProducts: build.query({
			query: ({page, limit, searchTerm }) => ({
				url: "/products/get-all",
				method: "GET",
				params: { page, limit, searchTerm },
			}),
			providesTags: ["product"],
		}),
     getSingleProduct: build.query({
			query: (id) => ({
				url: `/products/${id}`,
			}),
			providesTags: ["product"],
	 }),

		updateProduct: build.mutation({
			query: ({ id, ...info }) => ({
				url: `/products/${id}`,
				method: "PATCH",
				body: info,
			}),
			invalidatesTags: [ "product" ],
		}),
		deleteProduct: build.mutation({
			query: (id) => ({
				url: `/products/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [ "product" ],
		}),}),

});

export const {
	useCreateProductMutation,
	useGetAllProductsQuery,
	useGetSingleProductQuery,
	useUpdateProductMutation,
	useDeleteProductMutation,
} = productsApi;
