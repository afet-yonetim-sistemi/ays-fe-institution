export const formatDate = (date: string) => {
  const dateObject: Date = new Date(date)

  const day: number = dateObject.getDate()
  const month: number = dateObject.getMonth() + 1 // Months are zero-indexed
  const year: number = dateObject.getFullYear()
  const hours: number = dateObject.getHours()
  const minutes: number = dateObject.getMinutes()

  const formattedDate: string = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  return formattedDate // Output: 20.05.2024 19:06
}
