import { DateTime } from 'luxon'

export const formatDateTime = (date: string | null): string | null => {
  if (!date) {
    return ''
  }
  return DateTime.fromISO(date, { zone: 'UTC' })
    .setZone(DateTime.local().zoneName)
    .toFormat('dd.MM.yyyy HH:mm')
}
