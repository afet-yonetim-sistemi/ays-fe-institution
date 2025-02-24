import { Sort } from '@/common/types'
import { useRouter, useSearchParams } from 'next/navigation'

const getNextSortDirection = (
  currentDirection?: 'asc' | 'desc'
): 'asc' | 'desc' | undefined => {
  if (currentDirection === 'asc') return 'desc'
  if (currentDirection === 'desc') return undefined
  return 'asc'
}

const updateSorts = (sorts: Sort[], columnId: string): Sort[] => {
  const updatedSorts = [...sorts]
  const existingIndex = updatedSorts.findIndex((s) => s?.column === columnId)

  if (existingIndex > -1) {
    const existingSort = updatedSorts[existingIndex]
    if (existingSort) {
      existingSort.direction = getNextSortDirection(existingSort.direction)

      if (!existingSort.direction) {
        updatedSorts.splice(existingIndex, 1)
      } else {
        updatedSorts[existingIndex] = existingSort
      }
    }
  } else {
    updatedSorts.push({ column: columnId, direction: 'asc' })
  }

  return updatedSorts.filter((s): s is Sort => s?.direction !== undefined)
}

export const useSort = (
  initialSorts: Sort[] = []
): ((column: { id: string }) => void) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (column: { id: string }) => {
    const validSorts = updateSorts(initialSorts, column.id)

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
