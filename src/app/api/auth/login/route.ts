import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json(data);

  // ✅ accessToken → middleware পড়বে
  if (data?.data?.accessToken) {
    response.cookies.set("token", data.data.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60,        // 1 hour
      path: "/",
    });
  }

  // ✅ refreshToken → Vercel domain এ save করো
  if (data?.data?.refreshToken) {
    response.cookies.set("refreshToken", data.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,  // 7 days
      path: "/",
    });
  }

  return response;
}
