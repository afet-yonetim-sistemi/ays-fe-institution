export const formatPhoneNumber = (countryCode: string, lineNumber: string): string => {
    const formattedLineNumber = lineNumber.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2 $3 $4')
    return `+${countryCode} ${formattedLineNumber}`
  }