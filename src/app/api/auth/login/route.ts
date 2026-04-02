// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   const body = await request.json();

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     }
//   );

//   const data = await res.json();

//   if (!res.ok) {
//     return NextResponse.json(data, { status: res.status });
//   }

//   const response = NextResponse.json(data);

//   // ✅ accessToken → middleware পড়বে
//   if (data?.data?.accessToken) {
//     response.cookies.set("token", data.data.accessToken, {
//       httpOnly: false,
//       secure: true,
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24 * 7,       // 1 hour
//       path: "/",
//     });
//   }

//   // ✅ refreshToken → Vercel domain এ save করো
//   if (data?.data?.refreshToken) {
//     response.cookies.set("refreshToken", data.data.refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24 * 30,  // 30 days
//       path: "/",
//     });
//   }

//   return response;
// }


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

  if (data?.data?.accessToken) {
    response.cookies.set("token", data.data.accessToken, {
      httpOnly: true,    // ✅ JS access করতে পারবে না
      secure: true,
      sameSite: "strict", // ✅ CSRF protection
      maxAge: 60 * 60,   // ✅ 1 hour — accessToken expiry এর সমান
      path: "/",
    });
  }

  if (data?.data?.refreshToken) {
    response.cookies.set("refreshToken", data.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,  // 30 days
      path: "/api/auth",           // ✅ শুধু refresh route এ যাবে
    });
  }

  return response;
}
// ```

// ---

// ## Comparison
// ```
//                     তোমার Code        Improved
// ─────────────────────────────────────────────────
// token httpOnly      false ❌          true ✅
// XSS Protection      নেই ❌            আছে ✅
// CSRF Protection     lax (আংশিক)      strict ✅
// token maxAge        7 days ❌         1 hour ✅
// refreshToken path   / (সব route)❌   /api/auth ✅
