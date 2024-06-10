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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2 ">
            <DropdownMenuTrigger
              asChild
              className="hover:bg-muted/90 data-[state=open]:bg-muted rounded h-10 px-4 py-2"
            >
              <div className="flex gap-2 items-center">
                {t('status')}
                {selectStatus.length > 0 && (
                  <p className="px-1.5 py-1 text-xs text-white rounded-full text-center bg-blue-600">
                    {selectStatus.length}
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
      <DropdownMenuContent align="end" className="px-0">
        {StatusData.map((menu, id) => (
          <DropdownMenuCheckboxItem
            key={id}
            checked={selectStatus.includes(menu.value)}
            onCheckedChange={() => handleStatusChange(menu.value)}
            onSelect={(event) => event.preventDefault()}
            className="cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-2 hover:border-l-blue-700"
          >
            {t(`${menu.label}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SelectStatus
