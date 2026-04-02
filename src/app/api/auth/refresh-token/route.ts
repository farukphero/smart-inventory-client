import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!data?.data?.accessToken) {
    return NextResponse.json(data, { status: 401 });
  }

  const response = NextResponse.json(data);

  // ✅ Same domain এ নতুন token set করো
  response.cookies.set("token", data.data.accessToken, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
