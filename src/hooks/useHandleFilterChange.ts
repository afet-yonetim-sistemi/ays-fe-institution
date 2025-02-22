import { useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export const useHandleFilterChange = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return useCallback(
    (key: string, value: string | string[] | boolean) => {
      const updatedParams = new URLSearchParams(searchParams)
      updatedParams.set('page', '1')

      if (typeof value === 'boolean') {
        if (value) {
          updatedParams.set(key, 'true')
        } else {
          updatedParams.delete(key)
        }
      } else if (Array.isArray(value)) {
        updatedParams.set(key, value.join(','))
      } else {
        updatedParams.set(key, value)
      }

      // Update the URL without causing a full page re-render
      window.history.replaceState(
        null,
        '',
        `${pathname}?${updatedParams.toString()}`
      )
    },
    [pathname, searchParams]
  )
}
