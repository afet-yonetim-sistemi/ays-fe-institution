'use client'

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
import Status from '@/components/ui/status'

type StatusItem = {
  value: string
  label: string
  color: string
}

interface StatusFilterProps {
  statuses: StatusItem[]
  selectedStatuses: string[]
  onStatusChange: (statuses: string[]) => void
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statuses,
  selectedStatuses,
  onStatusChange,
}) => {
  const { t } = useTranslation()

  const handleSelectionChange = (value: string) => {
    const updatedStatuses = selectedStatuses.includes(value)
      ? selectedStatuses.filter((status) => status !== value)
      : [...selectedStatuses, value]
    onStatusChange(updatedStatuses)
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex w-fit items-center gap-2">
            <DropdownMenuTrigger
              asChild
              className="hover:bg-muted/90 data-[state=open]:bg-blue-600/10 data-[state=open]:text-blue-600 rounded h-10 px-4 py-2"
            >
              <div className="flex gap-2 items-center">
                {t('status')}
                {selectedStatuses.length > 0 && (
                  <p className="px-1.5 py-1 text-xs text-white rounded-full text-center bg-blue-600">
                    {selectedStatuses.length}
                  </p>
                )}
                <ChevronDown size={14} />
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t('status')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="start" className="px-0">
        {statuses.map((statusItem) => {
          const isSelected = selectedStatuses.includes(statusItem.value)
          return (
            <DropdownMenuCheckboxItem
              key={statusItem.value}
              checked={isSelected}
              onCheckedChange={() => handleSelectionChange(statusItem.value)}
              onSelect={(event) => event.preventDefault()}
              className="cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-2 hover:border-l-blue-700"
            >
              <Status status={statusItem} />
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StatusFilter
