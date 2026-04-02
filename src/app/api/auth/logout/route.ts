import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`, {
    method: "POST",
  });

  const response = NextResponse.json({ success: true });

  // ✅ দুইটা cookie ই clear করো
//   response.cookies.delete("token");
//   response.cookies.delete("refreshToken");

	 // ✅ দুইটা cookie ই clear করো
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,        // ✅ delete এর চেয়ে maxAge: 0 বেশি reliable
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/api/auth",  // ✅ set এর সময় যে path ছিল সেটা দিতে হবে
  });


  return response;
}
