import { ColumnDef, Column } from '@tanstack/table-core'
import { formatDateTime } from '@/lib/formatDateTime'
import i18next from 'i18next'
import { PhoneNumber, Sort } from '@/common/types'
import Status from '@/components/ui/status'
import DataTableSort from '@/components/ui/data-table-sort'
import { fallbackStatus } from '@/constants/fallBackStatus'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import { userStatuses } from '../constants/statuses'

export interface User {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber: PhoneNumber
  city: string
  status: string
  createdAt: string
}

export const columns: (
  filters: { sort: Sort[] },
  onSortClick: (column: Column<User>) => void
) => ColumnDef<User>[] = (filters, onSortClick) => {
  const sortState = filters.sort?.find((s) => s?.column === 'createdAt') || {
    column: '',
    direction: undefined,
  }

  return [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('user.firstName')}
          sortState={sortState}
          onSortClick={onSortClick}
        />
      ),
    },
    {
      accessorKey: 'lastName',
      header: () => i18next.t('user.lastName'),
    },
    {
      accessorKey: 'email',
      header: () => i18next.t('user.email'),
    },
    {
      accessorKey: 'phoneNumber',
      header: () => i18next.t('user.phoneNumber'),
      cell: ({ row }) => formatPhoneNumber(row.original.phoneNumber),
    },
    {
      accessorKey: 'city',
      header: () => i18next.t('user.city'),
    },
    {
      accessorKey: 'status',
      header: () => i18next.t('user.status'),
      cell: ({ row }) => {
        const status =
          userStatuses.find(
            (status) => status.value === row.getValue<string>('status')
          ) || fallbackStatus
        return <Status status={status} />
      },
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('user.createdAt')}
          sortState={sortState}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
  ]
}
