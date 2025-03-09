import { LabeledItem } from '@/common/types'

export const adminApplicationRegistrationStatuses: LabeledItem[] = [
  {
    label: 'status.waiting',
    value: 'WAITING',
    color: 'bg-yellow-500 text-white',
  },
  {
    label: 'status.completed',
    value: 'COMPLETED',
    color: 'bg-green-500 text-white',
  },
  {
    label: 'status.rejected',
    value: 'REJECTED',
    color: 'bg-red-500 text-white',
  },
  {
    label: 'status.approved',
    value: 'APPROVED',
    color: 'bg-sky-500 text-white',
  },
]
