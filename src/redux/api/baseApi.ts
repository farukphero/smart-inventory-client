import {
	BaseQueryApi,
	BaseQueryFn,
	createApi,
	DefinitionType,
	FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setUser } from "../features/Auth/authSlice";
import { tagTypesList } from "@/src/redux/tag-types";
import { handleLogout } from "@/src/utils";
import { RootState } from "@/src/redux/store";


// Define a service using a base URL and expected endpoints
const baseQuery = fetchBaseQuery({
	baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithRefreshToken: BaseQueryFn<
	FetchArgs,
	BaseQueryApi,
	DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
	let result = await baseQuery(args, api, extraOptions);
	if (result?.error?.status === 500) {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
				{
					method: "POST",
					credentials: "include",
				},
			);

			const data = await res.json();
			if (data?.data?.accessToken) {
				api.dispatch(
					setUser({
						token: data.data.accessToken,
					}),
				);
				// Retry the original request
				result = await baseQuery(args, api, extraOptions);
			} else {
				await handleLogout(api.dispatch, true);
			}
		} catch (error) {
			await handleLogout(api.dispatch, true);
		}
	}

	return result;
};

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithRefreshToken,
	tagTypes: tagTypesList,
	endpoints: () => ({}),
});
