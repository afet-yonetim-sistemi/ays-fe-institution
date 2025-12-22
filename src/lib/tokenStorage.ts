import { COOKIE_KEYS } from '@/constants/storageKey'
import Cookies from 'js-cookie'
import { parseJwt } from './helpers'

const getTokenExpirationInDays = (token: string): number => {
  try {
    const decoded = parseJwt(token)
    if (!decoded?.exp) {
      return 1 / 96
    }

    const expirationTime = decoded.exp * 1000
    const now = Date.now()
    const diffInMs = expirationTime - now

    if (diffInMs <= 0) {
      return 1 / 96
    }

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    return diffInDays
  } catch (error) {
    console.error('Token expiration parse hatası:', error)
    return 1 / 96
  }
}

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  const accessTokenExpires = getTokenExpirationInDays(accessToken)
  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
    expires: accessTokenExpires,
    secure: true,
    sameSite: 'strict',
  })

  const refreshTokenExpires = getTokenExpirationInDays(refreshToken)
  Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
    expires: refreshTokenExpires,
    secure: true,
    sameSite: 'strict',
  })
}

export const getAuthTokens = (): {
  accessToken: string | null
  refreshToken: string | null
} => {
  return {
    accessToken: Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? null,
    refreshToken: Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? null,
  }
}

export const clearAuthTokens = (): void => {
  Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN)
  Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN)
}

export const updateAccessToken = (accessToken: string): void => {
  const accessTokenExpires = getTokenExpirationInDays(accessToken)
  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
    expires: accessTokenExpires,
    secure: true,
    sameSite: 'strict',
  })
}
