'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableFilter } from '@/components/dataTable/dataTableFilter'
import { Input } from '../ui/input'
import { Label } from '@/components/ui/label'

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
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
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
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <div>
                  <Label htmlFor={column.value}>{column.label}</Label>
                  <Input
                    key={String(column.value)}
                    placeholder={column.placeholder}
                    value={
                      (table
                        .getColumn(String(column.value))
                        ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                      table
                        .getColumn(String(column.value))
                        ?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-40 lg:w-64"
                  />
                </div>
              ),
          )}

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
