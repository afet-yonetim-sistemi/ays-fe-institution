export const createRouteRegex = (route: string): RegExp =>
  new RegExp(
    '^' +
      route
        .replace(/\[([^\]]+)\]/g, '([\\w-]+)')
        .replace(/:([^\s/]+)\*/g, '(.*)') +
      '$'
  )

export const matchRoute = (
  pathname: string,
  routes: string[] | Record<string, string>
): { route: string; permission?: string } | null => {
  const entries: Array<[string, string | null]> = Array.isArray(routes)
    ? routes.map((route) => [route, null])
    : Object.entries(routes)

  for (const [route, permission] of entries) {
    const regex = createRouteRegex(route)
    if (regex.test(pathname)) {
      return { route, permission: permission ?? undefined }
    }
  }

  return null
}
