'use client'

import { ChevronDown } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

type DropdownItem<T> = {
  value: T
  label: string
  color: string
}

interface MultiSelectDropdownProps<T> {
  items: DropdownItem<T>[]
  selectedItems: T[]
  onSelectionChange: (selected: T[]) => void
  renderItem: (item: DropdownItem<T>, isSelected: boolean) => React.ReactNode
  label: string
}

const MultiSelectDropdown = <T extends string>({
  items,
  selectedItems,
  onSelectionChange,
  renderItem,
  label,
}: MultiSelectDropdownProps<T>): React.ReactElement => {
  const { t } = useTranslation()

  const handleSelectionChange = (value: T): void => {
    const updatedItems = selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value]
    onSelectionChange(updatedItems)
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex w-fit gap-2">
            <DropdownMenuTrigger
              asChild
              className="h-10 rounded px-4 py-2 hover:bg-muted/90 data-[state=open]:bg-blue-600/10 data-[state=open]:text-blue-600"
            >
              <div className="flex items-center gap-2">
                {t(label)}
                {selectedItems.length > 0 && (
                  <p className="rounded-full bg-blue-600 px-1.5 py-1 text-center text-xs text-white">
                    {selectedItems.length}
                  </p>
                )}
                <ChevronDown size={14} />
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t(label)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="start" className="px-0">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.value)
          return (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={isSelected}
              onCheckedChange={() => handleSelectionChange(item.value)}
              onSelect={(event) => event.preventDefault()}
              className="cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-2 hover:border-l-blue-700"
            >
              {renderItem(item, isSelected)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { MultiSelectDropdown }
export default MultiSelectDropdown
