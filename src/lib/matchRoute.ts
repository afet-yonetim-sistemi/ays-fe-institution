/**
 * Converts a route pattern into a RegExp for dynamic segments.
 */
function createRouteRegex(route: string): RegExp {
  return new RegExp(
    '^' +
      route
        .replace(/\[([^\]]+)\]/g, '([\\w-]+)') // Handle [id]
        .replace(/:([^\s/]+)\*/g, '(.*)') + // Handle :id*
      '$'
  )
}

/**
 * Matches a pathname against a list of routes.
 *
 * @param pathname - The current URL path to match.
 * @param routes - List of routes or a record with permissions.
 * @returns Matched route and its permission, if applicable.
 */
export function matchRoute(
  pathname: string,
  routes: string[] | Record<string, string>
): { route: string; permission?: string } | null {
  const entries: Array<[string, string | null]> = Array.isArray(routes)
    ? routes.map((route) => [route, null]) // Convert string[] to tuple array
    : Object.entries(routes) // Convert Record<string, string> to tuple array

  for (const [route, permission] of entries) {
    const regex = createRouteRegex(route)
    if (regex.test(pathname)) {
      return { route, permission: permission || undefined }
    }
  }

  return null // No match
}
