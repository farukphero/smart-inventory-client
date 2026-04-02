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
    : process.env.NEXT_PUBLIC_APP_URL + "/",       // Server → full URL
  credentials: "include",
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 500) {
    try {
      // ✅ Proxy দিয়ে refresh — same domain এ cookie set হবে
      const refreshResult = await proxyBaseQuery(
        {
          url: "api/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions
      );

      if (refreshResult?.data && (refreshResult.data as any)?.accessToken) {
        // ✅ Redux এ নতুন token save করো
        api.dispatch(
          setUser({
            token: (refreshResult.data as any).accessToken,
          })
        );
        // ✅ Original request আবার চালাও
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
