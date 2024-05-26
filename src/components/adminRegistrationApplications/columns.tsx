import { ColumnDef } from '@tanstack/table-core'
import { formatDate } from '@/app/hocs/formatDate'
import Status from '@/components/adminRegistrationApplications/status'
import { Button } from '@/components/ui/button'
import { BiSort } from 'react-icons/bi'
import i18next from 'i18next'

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
    header: () => i18next.t('admin.columnHeader.organization'),
  },
  {
    accessorKey: 'reason',
    header: () => i18next.t('admin.columnHeader.creationReason'),
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('admin.columnHeader.status'),
    cell: ({ row }) => <Status status={row.getValue('status')} />,
  },
  {
    accessorKey: 'createdUser',
    header: () => i18next.t('admin.columnHeader.createdUser'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {i18next.t('admin.columnHeader.createdAt')}
          <BiSort className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
]
