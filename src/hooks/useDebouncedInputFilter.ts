import { useMemo, useEffect } from 'react'
import { debounce } from 'lodash'

const useDebouncedInputFilter = (
  handleFilterChange: (key: string, value: string) => void,
  delay = 750
) => {
  const debouncedHandleFilterChange = useMemo(
    () =>
      debounce((key: string, value: string) => {
        handleFilterChange(key, value)
      }, delay),
    [handleFilterChange, delay]
  )

  useEffect(() => {
    return () => {
      debouncedHandleFilterChange.cancel()
    }
  }, [debouncedHandleFilterChange])

  return debouncedHandleFilterChange
}

export default useDebouncedInputFilter
