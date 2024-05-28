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
import { StatusData } from '@/constants/common'
import { useRouter } from 'next/navigation'

const SelectStatus = ({
  selectStatus,
  setSelectStatus,
}: {
  selectStatus: string[]
  setSelectStatus: any
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const handleStatusChange = (status: string) => {
    let newStatus
    if (selectStatus.includes(status)) {
      newStatus = selectStatus.filter((stat) => stat !== status)
    } else {
      newStatus = [...selectStatus, status]
    }
    setSelectStatus(newStatus)
    router.push('?page=1')
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
        <DropdownMenuCheckboxItem
          checked={selectStatus.length == 0}
          onCheckedChange={() => setSelectStatus([])}
          className="capitalize cursor-pointer"
        >
          {t(`all`)}
        </DropdownMenuCheckboxItem>
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
