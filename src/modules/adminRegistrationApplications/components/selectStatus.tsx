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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SelectStatus = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const filter = searchParams.get('filter')?.toUpperCase().split(',') || []
  const { replace } = useRouter()
  const { t } = useTranslation()

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    const filter = searchParams.get('filter')?.split(',') || []
    let newStatus
    if (filter.includes(status)) {
      newStatus = filter.filter((stat) => stat !== status)
    } else {
      newStatus = [...filter, status]
    }
    if (newStatus.length > 0) {
      params.set('filter', newStatus.join(','))
    } else {
      params.delete('filter')
    }
    replace(`${pathname}?${params.toString().replace(/%2C/g, ',')}`)
  }

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
                {t('status')}
                {filter.length > 0 && (
                  <p className="px-1.5 py-1 text-xs text-white rounded-full text-center bg-blue-600">
                    {filter.length}
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
            checked={filter.includes(menu.value)}
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
