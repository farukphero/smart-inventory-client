import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`, {
    method: "POST",
  });

  const response = NextResponse.json({ success: true });

  // ✅ দুইটা cookie ই clear করো
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");

  return response;
}
