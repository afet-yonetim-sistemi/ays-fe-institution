export const hasNoNumberNoSpecialChar = (str: string): boolean => {
  const strRegex = /^[a-zA-ZçÇğĞıİşŞüÜöÖ\s]+$/
  return strRegex.test(str)
}
