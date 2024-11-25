import { Column, ColumnDef } from '@tanstack/table-core'
import { formatDateTime } from '@/lib/formatDateTime'
import i18next from 'i18next'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import { formatReferenceNumber } from '@/lib/formatReferenceNumber'
import { PhoneNumber, Sort } from '@/common/types'
import Status from '@/components/ui/status'
import DataTableSort from '@/components/ui/data-table-sort'
import { emergencyEvacuationApplicationStatuses } from '../constants/statuses'
import { fallbackStatus } from '@/constants/fallBackStatus'

export interface EmergencyEvacuationApplication {
  id: string
  referenceNumber: string
  firstName: string
  lastName: string
  phoneNumber: PhoneNumber
  isInPerson: boolean
  seatingCount: number
  status: string
  createdAt: string
}

export const columns: (
  filters: { sort: Sort | undefined },
  onSortClick: (column: Column<EmergencyEvacuationApplication>) => void
) => ColumnDef<EmergencyEvacuationApplication>[] = (filters, onSortClick) => {
  const sortState = filters.sort || { column: '', direction: undefined }

  return [
    {
      accessorKey: 'referenceNumber',
      header: () => i18next.t('referenceNumber'),
      cell: ({ row }) => formatReferenceNumber(row.original.referenceNumber),
    },
    {
      accessorKey: 'firstName',
      header: () => i18next.t('applicantFirstName'),
      cell: ({ row }) => row.original.firstName,
    },
    {
      accessorKey: 'lastName',
      header: () => i18next.t('applicantLastName'),
      cell: ({ row }) => row.original.lastName,
    },
    {
      accessorKey: 'phoneNumber',
      header: () => i18next.t('phoneNumber'),
      cell: ({ row }) => formatPhoneNumber(row.original.phoneNumber),
    },
    {
      accessorKey: 'isInPerson',
      header: () => i18next.t('isInPerson'),
      cell: ({ row }) => i18next.t(row.original.isInPerson ? 'yes' : 'no'),
    },
    {
      accessorKey: 'seatingCount',
      header: () => i18next.t('seatingCount'),
      cell: ({ row }) => row.original.seatingCount,
    },
    {
      accessorKey: 'status',
      header: () => i18next.t('status'),
      cell: ({ row }) => {
        const status =
          emergencyEvacuationApplicationStatuses.find(
            (status) => status.value === row.getValue<string>('status')
          ) || fallbackStatus
        return <Status status={status} />
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('common.createdAt')}
          sortState={sortState}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
  ]
}
