export const formatReferenceNumber = (number: string) => {
  // Extract parts of the reference number
  const firstPart = number.slice(0, 1)
  const secondPart = number.slice(1, 4)
  const thirdPart = number.slice(4, 7)
  const fourthPart = number.slice(7, 10)

  return `${firstPart} ${secondPart} ${thirdPart} ${fourthPart}`
}
