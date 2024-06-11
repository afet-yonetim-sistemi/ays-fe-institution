import { ColumnDef } from '@tanstack/table-core'
import { formatDate } from '@/app/hocs/formatDate'
import Status from '@/modules/adminRegistrationApplications/components/status'
import { BiSort } from 'react-icons/bi'
import i18next from 'i18next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface AdminRegistrationApplication {
  id: string
  institution: { name: string }
  reason: string
  status: string
  createdUser: string
  createdAt: string
}

export const columns: ColumnDef<AdminRegistrationApplication>[] = [
  {
    accessorKey: 'institution.name',
    header: () => i18next.t('organization'),
    cell: ({ row }) => row.original.institution.name,
    size: 170,
  },
  {
    accessorKey: 'reason',
    header: () => i18next.t('creationReason'),
    cell: ({ row }) => row.original.reason,
    size: 500,
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('status'),
    cell: ({ row }) => <Status status={row.getValue('status')} />,
  },
  {
    accessorKey: 'createdUser',
    header: () => i18next.t('createdUser'),
    cell: ({ row }) => row.original.createdUser,
    size: 160,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="rounded transition-colors hover:bg-muted/90 w-full h-full p-2"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <span className="flex items-center gap-2">
                {i18next.t('createdAt')}
                <BiSort className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="uppercase">
              {column.getIsSorted()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 200,
    cell: ({ row }) => {
      return <div className="px-2">{formatDate(row.getValue('createdAt'))}</div>
    },
  },
]
