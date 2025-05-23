import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import i18n from 'i18next'
import { BiSort, BiSortDown, BiSortUp } from 'react-icons/bi'
import { Column } from '@tanstack/table-core'
import { SortDirection } from '@/common/types'

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
}: DataTableSortProps<T>) => {
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
          className="rounded transition-colors hover:bg-muted/90 w-full h-full"
          onClick={() => {
            column.toggleSorting()
            onSortClick(column)
          }}
        >
          <span className="flex items-center text-left gap-1">
            {label}
            <SortIcon sortDirection={sortDirection} />
          </span>
        </TooltipTrigger>
        <TooltipContent>{i18n.t(tooltipMessage)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SortIcon = ({ sortDirection }: { sortDirection: SortDirection }) => {
  const iconClass = 'w-4 h-4 min-w-4 min-h-4'

  if (sortDirection === 'asc') return <BiSortUp className={iconClass} />
  if (sortDirection === 'desc') return <BiSortDown className={iconClass} />
  return <BiSort className={iconClass} />
}

export default DataTableSort
