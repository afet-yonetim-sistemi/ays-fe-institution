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

interface DataTableSortProps<T> {
  column: Column<T>
  label: string
  sortState: { column: string; direction: 'asc' | 'desc' | null }
  onSortClick: (column: Column<T>) => void
}

const DataTableSort = <T extends object>({
  column,
  label,
  sortState,
  onSortClick,
}: DataTableSortProps<T>) => {
  const isCurrentColumn = column.id === sortState.column
  const sortDirection = isCurrentColumn ? sortState.direction : null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="rounded transition-colors hover:bg-muted/90 w-full h-full p-2"
          onClick={() => {
            column.toggleSorting()
            onSortClick(column)
          }}
        >
          <span className="flex items-center gap-2">
            {label}
            <SortIcon sort={sortDirection} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {i18n.t(
            sortDirection === 'asc'
              ? 'desc'
              : sortDirection === 'desc'
                ? 'clearSort'
                : 'asc'
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SortIcon = ({ sort }: { sort: string | null }) => {
  if (sort === 'asc') return <BiSortUp className="h-4 w-4" />
  if (sort === 'desc') return <BiSortDown className="h-4 w-4" />
  return <BiSort className="h-4 w-4" />
}

export default DataTableSort
