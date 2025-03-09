import { LabeledItem } from '@/common/types'

export const emergencyEvacuationApplicationStatuses: LabeledItem[] = [
  {
    label: 'status.pending',
    value: 'PENDING',
    color: 'bg-gray-500 text-white',
  },
  {
    label: 'status.inReview',
    value: 'IN_REVIEW',
    color: 'bg-teal-500 text-white',
  },
  {
    label: 'status.receivedFirstApprove',
    value: 'RECEIVED_FIRST_APPROVE',
    color: 'bg-blue-500 text-white',
  },
  {
    label: 'status.receivedSecondApprove',
    value: 'RECEIVED_SECOND_APPROVE',
    color: 'bg-blue-600 text-white',
  },
  {
    label: 'status.receivedThirdApprove',
    value: 'RECEIVED_THIRD_APPROVE',
    color: 'bg-blue-700 text-white',
  },
  {
    label: 'status.completed',
    value: 'COMPLETED',
    color: 'bg-green-500 text-white',
  },
  {
    label: 'status.cancelled',
    value: 'CANCELLED',
    color: 'bg-red-500 text-white',
  },
]
