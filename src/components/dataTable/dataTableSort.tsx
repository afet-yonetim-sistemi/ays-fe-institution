import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import i18next from 'i18next'
import i18n from 'i18next'
import { BiSort, BiSortDown, BiSortUp } from 'react-icons/bi'

const DataTableSort = ({ column }: { column: any }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="rounded transition-colors hover:bg-muted/90 w-full h-full p-2"
          onClick={() => column.toggleSorting()}
        >
          <span className="flex items-center gap-2">
            {i18next.t('createdAt')}
            <SortIcon sort={column.getIsSorted()} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {i18n.t(
            column.getIsSorted() == 'asc'
              ? 'desc'
              : column.getIsSorted() == 'desc'
                ? 'clearSort'
                : 'asc',
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SortIcon = ({ sort }: { sort: string }) => {
  if (sort == 'asc') return <BiSortUp className="h-4 w-4" />
  else if (sort == 'desc') return <BiSortDown className="h-4 w-4" />
  else return <BiSort className="h-4 w-4" />
}

export default DataTableSort
