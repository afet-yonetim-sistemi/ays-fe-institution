import { ColumnDef } from '@tanstack/table-core'
import { formatDate } from '@/app/hocs/formatDate'
import Status from '@/modules/adminRegistrationApplications/components/status'
import i18next from 'i18next'
import DataTableSort from '@/components/dataTable/dataTableSort'

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
    size: 170
  },
  {
    accessorKey: 'reason',
    header: () => i18next.t('creationReason'),
    cell: ({ row }) => row.original.reason,
    size: 500
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('status'),
    cell: ({ row }) => <Status status={row.getValue('status')} />,
    size: 140
  },
  {
    accessorKey: 'createdUser',
    header: () => i18next.t('createdUser'),
    cell: ({ row }) => row.original.createdUser,
    size: 160
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return <DataTableSort column={column} />
    },
    size: 155,
    cell: ({ row }) => {
      return <div className="px-2">{formatDate(row.getValue('createdAt'))}</div>
    }
  }
]
