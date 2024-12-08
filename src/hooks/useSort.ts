import { Sort } from '@/common/types'
import { useRouter, useSearchParams } from 'next/navigation'

export const useSort = (
  initialSorts: Sort[] = []
): ((column: { id: string }) => void) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (column: { id: string }) => {
    const columnId = column.id
    const updatedSorts = initialSorts ? [...initialSorts] : []

    const existingIndex = updatedSorts.findIndex((s) => s?.column === columnId)

    if (existingIndex > -1) {
      const existingSort = updatedSorts[existingIndex]
      if (existingSort) {
        existingSort.direction =
          existingSort.direction === 'asc'
            ? 'desc'
            : existingSort.direction === 'desc'
              ? undefined
              : 'asc'

        if (!existingSort.direction) {
          updatedSorts.splice(existingIndex, 1)
        } else {
          updatedSorts[existingIndex] = existingSort
        }
      }
    } else {
      updatedSorts.push({ column: columnId, direction: 'asc' })
    }

    const validSorts = updatedSorts.filter(
      (s): s is Sort => s?.direction !== undefined
    )

    const sortQuery = validSorts
      .map((s) => `${s?.column},${s?.direction}`)
      .join(';')

    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set('page', '1')
    updatedParams.set('sort', sortQuery)

    router.push(`?${updatedParams.toString()}`)
  }

  return handleSortChange
}
