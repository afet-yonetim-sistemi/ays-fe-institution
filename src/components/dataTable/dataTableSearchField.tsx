import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import i18next from 'i18next'
import type { Table } from '@tanstack/react-table'

interface DataTableSearchFieldProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  field: {
    value: string
    placeholder: string
    maxLength: number
    type: string
  }
}

const DataTableSearchField = <TData,>({
  field,
  table,
}: DataTableSearchFieldProps<TData>) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn(String(field.value))?.setFilterValue(event.target.value)
  }

  return (
    <div key={field.value} className="relative h-10">
      <Input
        className="block focus-visible:ring-0 focus-visible:ring-offset-0 p-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-[2px] border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={field.placeholder}
        id={field.value}
        maxLength={field.maxLength}
        type={field.type}
        value={
          (table.getColumn(String(field.value))?.getFilterValue() as string) ??
          ''
        }
        onChange={handleInputChange}
      />
      <Label
        htmlFor={field.value}
        className="absolute !left-3 rounded cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-1.5 z-10 origin-[0] bg-white dark:bg-background peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1.5 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {i18next.t(field.value)}
      </Label>
    </div>
  )
}

export default DataTableSearchField
