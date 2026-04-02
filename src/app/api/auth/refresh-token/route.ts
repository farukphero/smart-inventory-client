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
      body: JSON.stringify({ refreshToken }),  // ✅ body তে পাঠাও
    }
  );

  const data = await res.json();

	if (!res.ok || !data?.data?.accessToken) {
    // ✅ Refresh fail হলে cookie clear করো
    const response = NextResponse.json(
      { message: "Session expired" },
      { status: 401 }
    );
    response.cookies.delete("token");
    response.cookies.delete("refreshToken");
    return response;
  }


  if (!data?.data?.accessToken) {
    return NextResponse.json(data, { status: 401 });
  }

  const response = NextResponse.json(data);

  // ✅ token cookie update করো
  response.cookies.set("token", data.data.accessToken, {
     httpOnly: true,     // ✅ JS access করতে পারবে না
    secure: true,
    sameSite: "strict", // ✅ CSRF protection
    maxAge: 60 * 60,    // ✅ 1 hour
    path: "/",
  });

	// ✅ নতুন refreshToken আসলে সেটাও update করো
  if (data?.data?.refreshToken) {
    response.cookies.set("refreshToken", data.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/api/auth",
    });
  }


  return response;
}
