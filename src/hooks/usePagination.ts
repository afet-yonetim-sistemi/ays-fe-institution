import { useSearchParams, useRouter } from 'next/navigation'

export const usePagination = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number, path: string) => {
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set('page', page.toString())
    router.push(`${path}?${updatedParams.toString()}`)
  }

  return { handlePageChange }
}
