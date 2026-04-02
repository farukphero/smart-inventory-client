import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // ✅ Vercel domain এর cookie থেকে refreshToken পাও
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ body তে পাঠাও
      body: JSON.stringify({ refreshToken }),
    }
  );

  const data = await res.json();

  if (!data?.data?.accessToken) {
    return NextResponse.json(data, { status: 401 });
  }

  const response = NextResponse.json(data);

  // ✅ নতুন accessToken cookie update করো
  response.cookies.set("token", data.data.accessToken, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}
