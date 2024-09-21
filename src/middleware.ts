import { type NextRequest, NextResponse } from 'next/server'
import { protectedRoutes, publicRoutes } from './configs/routes'
import { getUserPermissions } from '@/lib/getUserPermissions'

const isPublicRoute = (pathname: string): boolean =>
  publicRoutes.includes(pathname)

const getMatchedRoutePattern = (pathname: string): string | undefined => {
  return Object.keys(protectedRoutes).find((route) => {
    const routePattern = new RegExp(`^${route.replace('[id]', '[^/]+')}$`)
    return routePattern.test(pathname)
  })
}

export const middleware = (request: NextRequest): NextResponse => {
  const { nextUrl, url, cookies } = request
  const token = cookies.get('token')?.value
  const { pathname } = nextUrl

  if (!isPublicRoute(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', url))
  }

  const matchedRoutePattern = getMatchedRoutePattern(pathname)
  const requiredPermission = matchedRoutePattern
    ? protectedRoutes[matchedRoutePattern]
    : null
  const userPermissions = token ? getUserPermissions(token) : []

  if (
    token &&
    requiredPermission &&
    !userPermissions.includes(requiredPermission)
  ) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/emergency-evacuation-applications',
    '/emergency-evacuation-applications/:id',
    '/admin-registration-applications',
    '/admin-registration-applications/:id',
    '/admin-registration-applications/pre-application',
    '/roles',
    '/roles/:id',
    '/dashboard',
  ],
}
