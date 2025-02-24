import { protectedRoutes, publicRoutes } from '@/configs/routes'

export const createRouteRegex = (route: string): RegExp => {
  const escapedRoute = route.replace(/[-/\\^$*+?.()|{}]/g, '\\$&')

  const regexPattern = escapedRoute.replace(/\[(\w+)\]/g, '([^/]+)')

  return new RegExp(`^${regexPattern}$`)
}

export const getRouteStatus = (
  pathname: string
): {
  isProtected: boolean
  route: string | null
  requiredPermission: string | null
} => {
  for (const [route, permission] of Object.entries(protectedRoutes)) {
    const regex = createRouteRegex(route)
    if (regex.test(pathname)) {
      return {
        isProtected: true,
        route,
        requiredPermission: permission,
      }
    }
  }

  for (const route of publicRoutes) {
    const regex = createRouteRegex(route)
    if (regex.test(pathname)) {
      return {
        isProtected: false,
        route,
        requiredPermission: null,
      }
    }
  }

  return {
    isProtected: false,
    route: null,
    requiredPermission: null,
  }
}
