import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthenticated = !!token

  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isPublicApi = pathname.startsWith('/api/auth')
  const isNextInternal = pathname.startsWith('/_next')
  const isApiRoute = pathname.startsWith('/api')

  if (isNextInternal || isPublicApi) return NextResponse.next()

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isAuthenticated && !isAuthPage) {
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
// ```

// ---

// ## Final Flow
// ```
// Login
//   ↓
// Backend → { accessToken, refreshToken } body তে পাঠায়
// Next.js → Vercel domain এ দুইটা cookie set করে
//   ├── token (accessToken) - middleware পড়ে
//   └── refreshToken (httpOnly) - refresh এ ব্যবহার হয়
//   ↓
// Middleware → token পায় ✅ → /dashboard ✅

// Token Expire
//   ↓
// Next.js proxy → Vercel domain এর refreshToken নেয় ✅
// Backend → নতুন accessToken দেয়
// token cookie update হয় ✅
