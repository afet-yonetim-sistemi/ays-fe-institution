import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { showErrorToast } from '@/lib/showToast'
import { AxiosError } from 'axios'

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
  onSuccess?: (data: T[], totalElements: number) => void
}

export const useDataFetcher = <T, F extends { page: number }>({
  fetchFunction,
  onSuccess,
}: UseDataFetcherOptions<T, F>) => {
  const router = useRouter()
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)

  const fetchData = useCallback(
    async (filters: F) => {
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
          router.push('/not-found')
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
    [fetchFunction, onSuccess, router]
  )

  const refetch = useCallback(
    (filters: F) => {
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
