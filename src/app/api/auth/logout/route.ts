import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Backend logout ও call করো
  await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const response = NextResponse.json({ success: true });
  response.cookies.delete("token");
  return response;
}
