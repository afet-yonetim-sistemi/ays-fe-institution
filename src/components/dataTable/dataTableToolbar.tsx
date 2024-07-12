'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableFilter } from '@/components/dataTable/dataTableFilter'
import i18next from 'i18next'
import { Input } from '@/components/ui/input'
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
      <div className="grid grid-cols-2 md:grid-cols-4 w-full py-2 items-center gap-x-2 gap-y-3">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <div key={column.value} className="relative h-10">
                  <Input
                    className="block focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border-[2px] border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder={column.placeholder}
                    id={column.value}
                    maxLength={column.maxLength}
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
                  />
                  <Label
                    htmlFor={column.value}
                    className="absolute left-2.5 rounded cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-1.5 z-10 origin-[0] bg-white dark:bg-background peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1.5 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    {i18next.t(column.value)}
                  </Label>
                </div>
              ),
          )}

        {children}

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
