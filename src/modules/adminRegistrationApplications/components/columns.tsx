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
    header: () => (
      <div className="w-40 min-w-40">{i18next.t('organization')}</div>
    ),
    cell: ({ row }) => (
      <div className="w-40 max-w-40">{row.original.institution.name}</div>
    ),
    size: 32,
  },
  {
    accessorKey: 'reason',
    header: () => (
      <div className="w-[500px]">{i18next.t('creationReason')}</div>
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] font-medium">{row.original.reason}</div>
    ),
    size: 400,
  },
  {
    accessorKey: 'status',
    header: () => <div className="w-24">{i18next.t('status')}</div>,
    cell: ({ row }) => (
      <div className="">
        <Status status={row.getValue('status')} />
      </div>
    ),
    size: 32,
    maxSize: 32,
  },
  {
    accessorKey: 'createdUser',
    header: () => <div className="w-32">{i18next.t('createdUser')}</div>,
    cell: ({ row }) => <div>{row.original.createdUser}</div>,
    size: 40,
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
