interface PhoneNumber {
  countryCode?: string
  lineNumber: string
}

export const formatPhoneNumber = (phoneNumberObj: PhoneNumber): string => {
  const { countryCode, lineNumber } = phoneNumberObj

  const phoneNumber = countryCode + lineNumber

  return phoneNumber.replace(
    /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
    '+$1 ($2) $3 $4 $5'
  )
}
