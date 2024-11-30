import { protectedRoutes, publicRoutes } from '@/configs/routes'

export const createRouteRegex = (route: string): RegExp =>
  new RegExp('^' + route.replace(/\[([^\]]+)\]/g, '([\\w-]+)') + '$')

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
