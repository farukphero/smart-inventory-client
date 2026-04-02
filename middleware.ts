// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('Middleware executed for:',token, request)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/signup')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isPublicApi = request.nextUrl.pathname.startsWith('/api/auth')

  // Redirect to dashboard if authenticated and on auth page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect to login if not authenticated and not on auth page or public api
  if (!token && !isAuthPage && !isPublicApi && !request.nextUrl.pathname.startsWith('/_next')) {
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
