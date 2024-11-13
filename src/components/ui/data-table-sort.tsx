/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import i18n from 'i18next'
import { BiSort, BiSortDown, BiSortUp } from 'react-icons/bi'

// eslint-disable-next-line
const DataTableSort = ({
  column,
  label,
  onSortClick,
}: {
  column: any
  label: string
  onSortClick: (column: any) => void
}) => (
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
          <SortIcon sort={column.getIsSorted()} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {i18n.t(
          column.getIsSorted() === 'asc'
            ? 'desc'
            : column.getIsSorted() === 'desc'
              ? 'clearSort'
              : 'asc'
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

// eslint-disable-next-line
const SortIcon = ({ sort }: { sort: string }) => {
  if (sort == 'asc') return <BiSortUp className="h-4 w-4" />
  else if (sort == 'desc') return <BiSortDown className="h-4 w-4" />
  else return <BiSort className="h-4 w-4" />
}

export default DataTableSort
