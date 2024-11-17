import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

type Sort = {
  column: string
  direction: 'asc' | 'desc' | null
}

export const useSort = (sort: Sort) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (column: { id: string }) => {
    const columnId = column.id
    const newDirection =
      sort.column === columnId
        ? sort.direction === 'asc'
          ? 'desc'
          : sort.direction === 'desc'
            ? null
            : 'asc'
        : 'asc'

    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set('page', '1')
    updatedParams.set('sort', newDirection ? `${columnId},${newDirection}` : '')
    router.push(`?${updatedParams.toString()}`)
  }

  return handleSortChange
}
