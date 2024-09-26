export const formatReferenceNumber = (number?: string | null): string => {
  if (!number) return ''
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
