'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import { DataTableFilter } from '@/components/dataTable/dataTableFilter'

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterFields?: any[]
}

const DataTableToolbar = <TData,>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) => {
  // Memoize computation of searchableColumns and filterableColumns
  const { filterableColumns } = React.useMemo(() => {
    return {
      filterableColumns: filterFields.filter((field) => field.options),
    }
  }, [filterFields])

  return (
    <div
      className={cn(
        'flex items-center justify-between space-x-2 overflow-auto p-1',
        className,
      )}
      {...props}
    >
      {children}
      <div className="flex flex-1 items-center space-x-2">
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <DataTableFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : '',
                  )}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}
      </div>
    </div>
  )
}

export default DataTableToolbar
