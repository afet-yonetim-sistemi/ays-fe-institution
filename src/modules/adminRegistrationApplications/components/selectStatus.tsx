import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { StatusData } from '@/modules/adminRegistrationApplications/constants/status'

interface StatusProps {
  selectStatus: string[]
  setSelectStatus: (state: string[]) => void
}

const SelectStatus = ({ selectStatus, setSelectStatus }: StatusProps) => {
  const { t } = useTranslation()
  const handleStatusChange = (status: string) => {
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
        <DropdownMenuCheckboxItem
          checked={selectStatus.length == 0}
          onCheckedChange={() => setSelectStatus([])}
          className="cursor-pointer"
        >
          {t(`all`)}
        </DropdownMenuCheckboxItem>
        {StatusData.map((menu, id) => (
          <DropdownMenuCheckboxItem
            key={id}
            checked={selectStatus.includes(menu.value)}
            onCheckedChange={() => handleStatusChange(menu.value)}
            className="cursor-pointer"
          >
            {t(`${menu.label}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SelectStatus
