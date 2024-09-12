export const isAlphanumericWithTurkishChars = (str: string): boolean => {
  const strRegex = /^[a-zA-Z0-9çÇğĞıİşŞüÜöÖ\s-]+$/
  return strRegex.test(str)
}
