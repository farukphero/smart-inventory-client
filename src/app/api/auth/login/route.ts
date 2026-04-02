import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Backend এ request পাঠাও
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

  if (!data?.data?.accessToken) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json(data);

  // ✅ Same domain এ cookie set করো
  response.cookies.set("token", data.data.accessToken, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
