'use client'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn/ui/tooltip'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
}: MultiSelectDropdownProps<T>): React.ReactNode => {
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
              className="hover:bg-muted/90 data-[state=open]:bg-primary/10 data-[state=open]:text-primary h-10 rounded px-4 py-2"
            >
              <div className="flex items-center gap-2">
                {t(label)}
                {selectedItems.length > 0 && (
                  <p className="bg-primary text-primary-foreground rounded-full px-1.5 py-1 text-center text-xs">
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
              className="hover:border-l-primary cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-2"
            >
              {renderItem(item, isSelected)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MultiSelectDropdown
