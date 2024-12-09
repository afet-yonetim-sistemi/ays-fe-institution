import { Sort } from '@/common/types'

export const getSortState = (columnName: string, filters: { sort: Sort[] }) => {
  return (
    filters.sort?.find((s) => s?.column === columnName) || {
      column: '',
      direction: undefined,
    }
  )
}
