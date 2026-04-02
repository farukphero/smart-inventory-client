import { cookies } from "next/headers"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // token cookie অথবা session cookie যেকোনো একটা থাকলেই হবে
  const token = request.cookies.get('token')?.value
  const session = request.cookies.get('connect.sid')?.value

  const isAuthenticated = !!(token || session)

   // সব cookies দেখো
  console.log('All cookies:', request.cookies.getAll())
  console.log('token:', request.cookies.get('token')?.value)
  console.log('connect.sid:', request.cookies.get('connect.sid')?.value)

// const cookies = request.cookies.getAll();
//   const value = cookies[0]?.value;

// console.log({value});
//   const token2 = request.cookies.get('_vercel_jwt')?.value;

// console.log('_vercel_jwttoken2:', token2);

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')

 console.log('isAuthenticated:', isAuthenticated)
 console.log('isAuthPage:', isAuthPage)

  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isPublicApi = request.nextUrl.pathname.startsWith('/api/auth')
  const isNextInternal = request.nextUrl.pathname.startsWith('/_next')

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isAuthenticated && !isAuthPage && !isPublicApi && !isNextInternal) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
