import { StatusData } from '@/constants/statusData'

export const getStatusLabel = (status: string): string => {
  const statusItem = StatusData.find((item) => item.value === status)
  return statusItem ? statusItem.label : ''
}
