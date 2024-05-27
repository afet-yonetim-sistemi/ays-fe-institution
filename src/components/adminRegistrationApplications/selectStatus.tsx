import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

const StatusData: string[] = [
  'ALL',
  'WAITING',
  'COMPLETED',
  'REJECTED',
  'VERIFIED',
]

const SelectStatus = ({ setSelectStatus }: { setSelectStatus: any }) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['ALL'])
  const { t } = useTranslation()
  const handleStatusChange = (status: string) => {
    if (status == 'ALL') {
      setSelectedStatuses(['ALL'])
      setSelectStatus([])
      return
    }
    if (selectedStatuses.includes('ALL')) {
      const updatedItems = selectedStatuses.filter((status) => status !== 'ALL')
      setSelectedStatuses(updatedItems)
    }
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
    setSelectStatus((prev: string[]) =>
      prev.includes(status)
        ? prev.filter((s: string) => s !== status)
        : [...prev, status],
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="space-x-1">
          <PlusCircle size={14} />
          <span>{t('admin.status')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {StatusData.map((menu) => (
          <DropdownMenuCheckboxItem
            key={menu}
            checked={selectedStatuses.includes(menu)}
            onCheckedChange={() => handleStatusChange(menu)}
            className="capitalize cursor-pointer"
          >
            {t(`admin.${menu.toLowerCase()}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SelectStatus
