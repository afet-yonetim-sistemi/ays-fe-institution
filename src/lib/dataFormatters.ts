import { DateTime } from 'luxon'
import { PhoneNumber } from '@/common/types'

export const formatDateTime = (date: string | null | undefined): string => {
  if (!date) return ''
  return DateTime.fromISO(date, { zone: 'UTC' })
    .setZone(DateTime.local().zoneName)
    .toFormat('dd.MM.yyyy HH:mm')
}

export const formatPhoneNumber = (
  phoneNumber: PhoneNumber | null | undefined
): string => {
  if (!phoneNumber) return ''
  const { countryCode = '', lineNumber } = phoneNumber
  const fullNumber = countryCode + lineNumber
  return fullNumber.replace(
    /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
    '+$1 ($2) $3 $4 $5'
  )
}

export const formatReferenceNumber = (
  number: string | null | undefined
): string => {
  if (!number) return ''
  return number.replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
}
