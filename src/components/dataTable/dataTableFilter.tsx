import React from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Column } from '@tanstack/table-core'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[])
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2 ">
            <DropdownMenuTrigger
              asChild
              className="hover:bg-muted/90 data-[state=open]:bg-blue-600/10 data-[state=open]:text-blue-600 rounded h-10 px-4 py-2"
            >
              <div className="flex gap-2 items-center">
                {t(`${title}`)}
                {selectedValues.size > 0 && (
                  <p className="px-1.5 py-1 text-xs text-white rounded-full text-center bg-blue-600">
                    {selectedValues.size}
                  </p>
                )}
                <ChevronDown size={14} />
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t(`${title}`)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="start" className="px-0">
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value)
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={() => {
                if (isSelected) {
                  selectedValues.delete(option.value)
                } else {
                  selectedValues.add(option.value)
                }
                const filterValues = Array.from(selectedValues)
                column?.setFilterValue(
                  filterValues.length ? filterValues : undefined,
                )
              }}
              onSelect={(event) => event.preventDefault()}
              className="cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-2 hover:border-l-blue-700"
            >
              {t(`${option.label}`)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
