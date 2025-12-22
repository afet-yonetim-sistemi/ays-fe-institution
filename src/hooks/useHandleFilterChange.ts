import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const useHandleFilterChange = (): ((
  key: string,
  value: string | string[] | boolean
) => void) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleFilterChange = useCallback(
    (key: string, value: string | string[] | boolean) => {
      const updatedParams = new URLSearchParams(searchParams)
      updatedParams.set('page', '1')

      if (typeof value === 'boolean') {
        if (value) {
          updatedParams.set(key, 'true')
        }
        if (!value) {
          updatedParams.delete(key)
        }
        router.push(`${pathname}?${updatedParams.toString()}`)
        return
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          updatedParams.set(key, value.join(','))
        }
        if (value.length === 0) {
          updatedParams.delete(key)
        }
        router.push(`${pathname}?${updatedParams.toString()}`)
        return
      }

      if (value.trim()) {
        updatedParams.set(key, value)
      }
      if (!value.trim()) {
        updatedParams.delete(key)
      }

      router.push(`${pathname}?${updatedParams.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return handleFilterChange
}
