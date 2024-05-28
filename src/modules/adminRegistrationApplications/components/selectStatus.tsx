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
import status from '@/modules/adminRegistrationApplications/components/status'

const StatusData: string[] = [
  'ALL',
  'WAITING',
  'COMPLETED',
  'REJECTED',
  'VERIFIED',
]

const SelectStatus = ({
  selectStatus,
  setSelectStatus,
}: {
  selectStatus: string[]
  setSelectStatus: any
}) => {
  const { t } = useTranslation()
  const handleStatusChange = (status: string) => {
    if (status == 'ALL') {
      setSelectStatus([])
      return
    }
    let newStatus
    if (selectStatus.includes(status)) {
      newStatus = selectStatus.filter((stat) => stat !== status)
    } else {
      newStatus = [...selectStatus, status]
    }
    setSelectStatus(newStatus)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="space-x-1">
          <PlusCircle size={14} />
          <span>{t('status')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {StatusData.map((menu) => (
          <DropdownMenuCheckboxItem
            key={menu}
            checked={selectStatus.includes(menu)}
            onCheckedChange={() => handleStatusChange(menu)}
            className="capitalize cursor-pointer"
          >
            {t(`${menu.toLowerCase()}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SelectStatus
