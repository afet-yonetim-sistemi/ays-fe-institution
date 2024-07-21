'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableFilter } from '@/components/dataTable/dataTableFilter'
import QuickFilter from '@/components/dataTable/quickFilter'
import DataTableSearchField from '@/components/dataTable/dataTableSearchField'

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
  return (
    <div
      className={cn(
        'flex items-center justify-between space-x-2 p-1',
        className,
      )}
      {...props}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 w-full py-2 items-center gap-x-2 gap-y-3">
        {filterFields.length > 0 &&
          filterFields.map((field) => {
            if (field.fieldsType == 'inputField')
              return (
                <DataTableSearchField
                  key={String(field.value)}
                  field={field}
                  table={table}
                />
              )
            else if (field.fieldsType == 'selectBoxField')
              return (
                <DataTableFilter
                  key={String(field.value)}
                  column={table.getColumn(
                    field.value ? String(field.value) : '',
                  )}
                  title={field.label}
                  options={field.options ?? []}
                />
              )
            else if (field.fieldsType == 'quickFilterField')
              return (
                <QuickFilter
                  key={field.value}
                  label={field.label}
                  column={table.getColumn(field.value)}
                />
              )
          })}
        {children}
      </div>
    </div>
  )
}

export default DataTableToolbar
