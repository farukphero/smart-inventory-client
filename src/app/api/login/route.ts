import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json(data);

  // ✅ Backend এর cookie গুলো forward করো (refreshToken এর জন্য)
//   const backendCookies = res.headers.get("set-cookie");
//   if (backendCookies) {
//     response.headers.set("set-cookie", backendCookies);
//   }

  // ✅ আলাদাভাবে শুধু accessToken টা middleware এর জন্য set করো
  if (data?.data?.refreshToken) {
    response.cookies.set("token", data.data.refreshToken, {
      httpOnly: false,   // middleware + JS পড়তে পারবে
      secure: true,
      sameSite: "lax",
      maxAge: 60,   // ← accessToken এর মেয়াদ অনুযায়ী দাও (১ ঘণ্টা)
      path: "/",
    });
  }

  return response;
}
