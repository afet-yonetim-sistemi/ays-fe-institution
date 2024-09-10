import { NextResponse, type NextRequest } from 'next/server'
import { parseJwt } from '@/lib/helpers'

const protectedRoutes: { [key: string]: string } = {
  '/emergency-evacuation-applications': 'application:evacuation:list',
  '/emergency-evacuation-applications/[id]': 'application:evacuation:detail',
  '/admin-registration-applications': 'application:registration:list',
  '/admin-registration-applications/pre-application':
    'application:registration:create',
  '/admin-registration-applications/[id]': 'application:registration:detail',
  '/role-listing': 'role:list',
  '/role-listing/[id]': 'role:detail',
  '/dashboard': 'institution:page',
}

const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { nextUrl, url, cookies } = request

  const token = cookies.get('token')?.value

  const isPublicRoute = publicRoutes.some((route) => route === nextUrl.pathname)
  if (!isPublicRoute && !token) {
    // Token yoksa ve korunan bir route'a erişmeye çalışıyorsa, login sayfasına yönlendirin
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if ((token && nextUrl.pathname === '/login') || nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', url))
  }

  //Permission kontrol
  const matchedRoute = Object.keys(protectedRoutes).find((route) => {
    const routePattern = new RegExp('^' + route.replace('[id]', '[^/]+') + '$')
    return routePattern.test(nextUrl.pathname)
  })
  const requiredPermission = matchedRoute ? protectedRoutes[matchedRoute] : null
  const userPermissions = (token &&
    parseJwt(token?.toString())?.userPermissions) || ['']
  if (token && !userPermissions.includes(requiredPermission)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/emergency-evacuation-applications/:id*',
    '/emergency-evacuation-applications',
    '/admin-registration-applications',
    '/admin-registration-applications/pre-application',
    '/admin-registration-applications/:id*',
    '/role-listing',
    '/role-listing/:id*',
    '/dashboard',
    '/login',
  ],
}
