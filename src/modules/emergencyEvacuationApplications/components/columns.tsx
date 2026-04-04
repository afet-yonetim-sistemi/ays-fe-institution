import { PhoneNumber, Sort } from '@/common/types'
import DataTableSort from '@/components/custom/data-table-sort'
import Status from '@/components/custom/status'
import { fallbackStatus } from '@/constants/fallBackStatus'
import {
  formatDateTime,
  formatPhoneNumber,
  formatReferenceNumber,
} from '@/lib/dataFormatters'
import { getSortState } from '@/lib/getSortState'
import PriorityIcon from '@/modules/emergencyEvacuationApplications/components/PriorityIcon'
import { EmergencyEvacuationApplicationPriority } from '@/modules/emergencyEvacuationApplications/constants/priorities'
import { Column, ColumnDef } from '@tanstack/table-core'
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
  priority: EmergencyEvacuationApplicationPriority
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
      id: 'priority',
      accessorFn: (row) => row.priority,
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('application.evacuation.priority')}
          sortState={getSortState('priority', filters)}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => <PriorityIcon priority={row.original.priority} />,
    },
    {
      accessorKey: 'status',
      header: () => i18next.t('application.status'),
      cell: ({ row }): React.ReactNode => {
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
