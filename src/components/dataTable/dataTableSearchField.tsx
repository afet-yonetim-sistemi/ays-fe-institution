import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import i18next from 'i18next'
import type { Table } from '@tanstack/react-table'
import { toast } from '@/components/ui/use-toast'
import { getValidationSchema } from '@/components/dataTable/validationSchemas'

interface DataTableSearchFieldProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  field: {
    value: string
    placeholder: string
    type: string
  }
}

const DataTableSearchField = <TData,>({
  field,
  table,
  // eslint-disable-next-line
}: DataTableSearchFieldProps<TData>) => {
  const schema = getValidationSchema(field.value)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = event.target.value
    const validation = schema.safeParse(inputValue)

    if (validation.success) {
      table.getColumn(String(field.value))?.setFilterValue(inputValue)
    } else {
      toast({
        title: validation.error.errors[0].message,
        variant: 'destructive',
      }) // Set the error message
    }
  }
  // eslint-disable-next-line
  const onInputHandle = (e: any): void => {
    if (field.type == 'number') {
      const onlyNumber = ['seatingCount', 'referenceNumber']
      if (onlyNumber.includes(field.value)) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '')
      }
    }
  }

  return (
    <div key={field.value} className="relative h-10">
      <Input
        className="block focus-visible:ring-0 focus-visible:ring-offset-0 p-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-[2px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={field.placeholder}
        id={field.value}
        type={field.type}
        value={
          (table.getColumn(String(field.value))?.getFilterValue() as string) ??
          ''
        }
        onChange={handleInputChange}
        onInput={onInputHandle}
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
