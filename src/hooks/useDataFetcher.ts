import { MAX_PAGE_NUMBER, MIN_PAGE_NUMBER } from '@/constants/pagination'
import { showErrorToast } from '@/lib/showToast'
import { AxiosError } from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ApiResponse<T> {
  data: {
    isSuccess: boolean
    response: {
      content: T[]
      totalElementCount: number
      totalPageCount: number
    }
  }
}

interface UseDataFetcherOptions<T, F> {
  fetchFunction: (filters: F) => Promise<ApiResponse<T>>
  filters?: F
  enabled?: boolean
  onSuccess?: (data: T[], totalElements: number) => void
}

interface UseDataFetcherReturn<T, F extends { page: number }> {
  data: T[]
  isLoading: boolean
  totalRows: number
  fetchData: (filters: F) => Promise<void>
  refetch: (filters: F) => void
}

export const useDataFetcher = <T, F extends { page: number }>({
  fetchFunction,
  filters,
  enabled = true,
  onSuccess,
}: UseDataFetcherOptions<T, F>): UseDataFetcherReturn<T, F> => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(enabled && !!filters)
  const [totalRows, setTotalRows] = useState(0)
  const lastFetchedFilters = useRef<string>('')

  const fetchData = useCallback(
    async (filters: F) => {
      if (filters.page < MIN_PAGE_NUMBER || filters.page >= MAX_PAGE_NUMBER) {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
        return
      }

      setIsLoading(true)

      try {
        const response = await fetchFunction(filters)

        if (!response.data.isSuccess) {
          showErrorToast()
          return
        }

        const { content, totalElementCount, totalPageCount } =
          response.data.response

        if (filters.page > totalPageCount && totalPageCount !== 0) {
          const params = new URLSearchParams(searchParams)
          params.set('page', '1')
          router.push(`${pathname}?${params.toString()}`)
          return
        }

        setData(content)
        setTotalRows(totalElementCount)

        if (onSuccess) {
          onSuccess(content, totalElementCount)
        }
      } catch (error) {
        showErrorToast(
          error instanceof Error ? (error as AxiosError) : undefined
        )
      } finally {
        setIsLoading(false)
      }
    },
    [fetchFunction, onSuccess, router, pathname, searchParams]
  )

  useEffect(() => {
    if (!filters || !enabled) return

    const filtersKey = JSON.stringify(filters)

    if (lastFetchedFilters.current === filtersKey) return

    lastFetchedFilters.current = filtersKey
    fetchData(filters)
  }, [filters, enabled, fetchData])

  const refetch = useCallback(
    (filters: F) => {
      lastFetchedFilters.current = ''
      fetchData(filters)
    },
    [fetchData]
  )

  return {
    data,
    isLoading,
    totalRows,
    fetchData,
    refetch,
  }
}
