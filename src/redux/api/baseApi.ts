// import {
// 	BaseQueryApi,
// 	BaseQueryFn,
// 	createApi,
// 	DefinitionType,
// 	FetchArgs,
// 	fetchBaseQuery,
// } from "@reduxjs/toolkit/query/react";
// import { setUser } from "../features/Auth/authSlice";
// import { tagTypesList } from "@/src/redux/tag-types";
// import { handleLogout } from "@/src/utils";
// import { RootState } from "@/src/redux/store";


// // Define a service using a base URL and expected endpoints
// const baseQuery = fetchBaseQuery({
// 	baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,
// 	credentials: "include",
// 	prepareHeaders: (headers, { getState }) => {
// 		const token = (getState() as RootState).auth.token;
// 		if (token) {
// 			headers.set("authorization", `Bearer ${token}`);
// 		}
// 		return headers;
// 	},
// });

// const baseQueryWithRefreshToken: BaseQueryFn<
// 	FetchArgs,
// 	BaseQueryApi,
// 	DefinitionType
// > = async (args, api, extraOptions): Promise<any> => {
// 	let result = await baseQuery(args, api, extraOptions);
// 	if (result?.error?.status === 500) {
// 		try {
// 			const res = await fetch(
// 				`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
// 				{
// 					method: "POST",
// 					credentials: "include",
// 				},
// 			);

// 			const data = await res.json();
// 			if (data?.data?.accessToken) {
// 				api.dispatch(
// 					setUser({
// 						token: data.data.accessToken,
// 					}),
// 				);
// 				// Retry the original request
// 				result = await baseQuery(args, api, extraOptions);
// 			} else {
// 				await handleLogout(api.dispatch, true);
// 			}
// 		} catch (error) {
// 			await handleLogout(api.dispatch, true);
// 		}
// 	}

// 	return result;
// };

// export const baseApi = createApi({
// 	reducerPath: "api",
// 	baseQuery: baseQueryWithRefreshToken,
// 	tagTypes: tagTypesList,
// 	endpoints: () => ({}),
// });


import { RootState } from "@/src/redux/store";
import { tagTypesList } from "@/src/redux/tag-types";
import { handleLogout } from "@/src/utils";
import {
	BaseQueryApi,
	BaseQueryFn,
	createApi,
	DefinitionType,
	FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setUser } from "../features/Auth/authSlice";

// ✅ Backend এর জন্য
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

// ✅ Next.js Proxy এর জন্য (cookie same domain এ set হবে)
const proxyBaseQuery = fetchBaseQuery({
  baseUrl: typeof window !== "undefined"
    ? "/"                                          // Browser → relative
    : process.env.NEXT_PUBLIC_BASE_API_URL + "/",       // Server → full URL
  credentials: "include",
});

 const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  // ❌ refresh request নিজে হলে আবার refresh call হবে না
  if (args?.url === "/api/auth/refresh-token") {
    return result;
  }

  if (result?.error?.status === 401) {
    try {
      const refreshResult = await proxyBaseQuery(
        {
          url: "/api/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions
      );

      const newToken = (refreshResult.data as any)?.accessToken;

      if (newToken) {
        api.dispatch(
          setUser({
            token: newToken,
          })
        );

        // retry original request
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
