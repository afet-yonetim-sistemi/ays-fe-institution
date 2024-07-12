export const formatPhoneNumber = (phoneNumberObj: any) => {
  const { countryCode, lineNumber } = phoneNumberObj

  // Clean the line number to remove any non-digit characters
  const cleanLineNumber = lineNumber.replace(/[^\d]/g, '')

  // Extract parts of the line number
  const areaCode = cleanLineNumber.slice(0, 3)
  const firstPart = cleanLineNumber.slice(3, 6)
  const secondPart = cleanLineNumber.slice(6, 8)
  const thirdPart = cleanLineNumber.slice(8, 10)

  return `+${countryCode} (${areaCode}) ${firstPart} ${secondPart} ${thirdPart}`
}
