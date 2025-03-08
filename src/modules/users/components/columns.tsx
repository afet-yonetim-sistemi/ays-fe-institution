import { PhoneNumber, Sort } from '@/common/types'
import DataTableSort from '@/components/ui/data-table-sort'
import Status from '@/components/ui/status'
import { fallbackStatus } from '@/constants/fallBackStatus'
import { formatDateTime, formatPhoneNumber } from '@/lib/dataFormatters'
import { getSortState } from '@/lib/getSortState'
import { Column, ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
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
  return [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('common.firstName')}
          sortState={getSortState('firstName', filters)}
          onSortClick={onSortClick}
        />
      ),
    },
    {
      accessorKey: 'lastName',
      header: () => i18next.t('common.lastName'),
    },
    {
      accessorKey: 'emailAddress',
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
          label={i18next.t('common.createdAt')}
          sortState={getSortState('createdAt', filters)}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
  ]
}
