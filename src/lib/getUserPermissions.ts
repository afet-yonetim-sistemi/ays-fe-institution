import { parseJwt } from '@/lib/helpers'

export const getUserPermissions = (token: string): string[] => {
  const parsedToken = parseJwt(token)
  return parsedToken?.userPermissions || []
}
