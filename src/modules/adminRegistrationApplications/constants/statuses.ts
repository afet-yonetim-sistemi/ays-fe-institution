import { LabeledItem } from '@/common/types'

export enum AdminRegistrationApplicationStatus {
  WAITING = 'WAITING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export const adminApplicationRegistrationStatuses: LabeledItem[] = [
  {
    label: 'status.waiting',
    value: AdminRegistrationApplicationStatus.WAITING,
    color: 'bg-yellow-500 text-white',
  },
  {
    label: 'status.completed',
    value: AdminRegistrationApplicationStatus.COMPLETED,
    color: 'bg-green-500 text-white',
  },
  {
    label: 'status.rejected',
    value: AdminRegistrationApplicationStatus.REJECTED,
    color: 'bg-red-500 text-white',
  },
  {
    label: 'status.approved',
    value: AdminRegistrationApplicationStatus.APPROVED,
    color: 'bg-sky-500 text-white',
  },
]
