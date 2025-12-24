'use client'

import { SortDirection } from '@/common/types'
import { Column } from '@tanstack/react-table'
import i18n from 'i18next'
import { BiSort, BiSortDown, BiSortUp } from 'react-icons/bi'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface DataTableSortProps<T> {
  column: Column<T>
  label: string
  sortState: { column: string; direction: SortDirection }
  onSortClick: (column: Column<T>) => void
}

const DataTableSort = <T extends object>({
  column,
  label,
  sortState,
  onSortClick,
}: DataTableSortProps<T>): JSX.Element => {
  const isCurrentColumn = sortState?.column === column.id
  const sortDirection = isCurrentColumn ? sortState?.direction : undefined

  let tooltipMessage = 'sort.ascending'
  if (sortDirection === 'asc') {
    tooltipMessage = 'sort.descending'
  } else if (sortDirection === 'desc') {
    tooltipMessage = 'sort.clear'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="h-full w-full rounded transition-colors hover:bg-muted/90"
          onClick={() => {
            column.toggleSorting()
            onSortClick(column)
          }}
        >
          <span className="flex items-center gap-1 text-left">
            {label}
            <SortIcon sortDirection={sortDirection} />
          </span>
        </TooltipTrigger>
        <TooltipContent>{i18n.t(tooltipMessage)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SortIcon = ({
  sortDirection,
}: {
  sortDirection: SortDirection
}): JSX.Element => {
  const iconClass = 'w-4 h-4 min-w-4 min-h-4'

  if (sortDirection === 'asc') return <BiSortUp className={iconClass} />
  if (sortDirection === 'desc') return <BiSortDown className={iconClass} />
  return <BiSort className={iconClass} />
}

export { DataTableSort }
export default DataTableSort
