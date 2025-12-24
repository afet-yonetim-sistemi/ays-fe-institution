import { PhoneNumber, Sort } from '@/common/types'
// eslint-disable-next-line no-restricted-imports
import DataTableSort from '@/components/ui/data-table-sort'
// eslint-disable-next-line no-restricted-imports
import Status from '@/components/ui/status'
import { fallbackStatus } from '@/constants/fallBackStatus'
import {
  formatDateTime,
  formatPhoneNumber,
  formatReferenceNumber,
} from '@/lib/dataFormatters'
import { getSortState } from '@/lib/getSortState'
import { Column, ColumnDef } from '@tanstack/react-table'
import i18next from 'i18next'
import { emergencyEvacuationApplicationStatuses } from '../constants/statuses'

export interface EmergencyEvacuationApplication {
  id: string
  referenceNumber: string
  applicantFirstName?: string
  applicantLastName?: string
  applicantPhoneNumber?: PhoneNumber
  firstName?: string
  lastName?: string
  phoneNumber?: PhoneNumber
  isInPerson: boolean
  seatingCount: number
  status: string
  createdAt: string
}

export const columns: (
  filters: { sort: Sort[] },
  onSortClick: (column: Column<EmergencyEvacuationApplication>) => void
) => ColumnDef<EmergencyEvacuationApplication>[] = (filters, onSortClick) => {
  return [
    {
      accessorKey: 'referenceNumber',
      header: () => i18next.t('application.evacuation.referenceNumber'),
      cell: ({ row }) => formatReferenceNumber(row.original.referenceNumber),
    },
    {
      accessorKey: 'firstName',
      header: () => i18next.t('application.firstName'),
      cell: ({ row }) =>
        row.original.isInPerson
          ? row.original.firstName
          : row.original.applicantFirstName,
    },
    {
      accessorKey: 'lastName',
      header: () => i18next.t('application.lastName'),
      cell: ({ row }) =>
        row.original.isInPerson
          ? row.original.lastName
          : row.original.applicantLastName,
    },
    {
      accessorKey: 'phoneNumber',
      header: () => i18next.t('application.phoneNumber'),
      cell: ({ row }) =>
        formatPhoneNumber(
          row.original.isInPerson
            ? row.original.phoneNumber
            : row.original.applicantPhoneNumber
        ),
    },
    {
      accessorKey: 'isInPerson',
      header: () => i18next.t('application.evacuation.inPerson?'),
      cell: ({ row }) =>
        i18next.t(row.original.isInPerson ? 'common.yes' : 'common.no'),
    },
    {
      accessorKey: 'seatingCount',
      header: () => i18next.t('application.evacuation.seatingCount'),
      cell: ({ row }) => row.original.seatingCount,
    },
    {
      accessorKey: 'status',
      header: () => i18next.t('application.status'),
      cell: ({ row }): JSX.Element => {
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
          sortState={getSortState('createdAt', filters)}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
  ]
}
