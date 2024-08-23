import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { clsx } from 'clsx'
import i18next from 'i18next'
import { Column } from '@tanstack/table-core'

interface DataTableQuickFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  label: string
}

const QuickFilter = <TData, TValue>({
  label,
  column,
}: DataTableQuickFilterProps<TData, TValue>) => {
  const isChecked = column?.getFilterValue() === true

  return (
    <Label
      htmlFor={label}
      className={clsx(
        'text-sm cursor-pointer bg-zinc-300/20 flex items-center gap-1.5 rounded h-10 px-4 py-2',
        {
          'bg-blue-600/10 text-blue-600': isChecked,
        }
      )}
    >
      <Checkbox
        className="border-none bg-zinc-300/50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white "
        checked={isChecked}
        id={label}
        onCheckedChange={(event) => {
          column?.setFilterValue(event ? true : undefined)
        }}
      />
      {i18next.t(label)}
    </Label>
  )
}

export default QuickFilter
