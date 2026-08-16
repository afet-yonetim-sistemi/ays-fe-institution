export const nameFormRegex = /^(?! )[a-zA-ZçÇğĞıİöÖşŞüÜ ,.'-]+(?<! )$/u
export const nameFilterRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ ,.'-]*$/u

export const roleFormRegex = /^(?! )[a-zA-ZçÇğĞıİöÖşŞüÜ0-9 /&|_\-,.']+(?<! )$/u
export const roleFilterRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9 /&|_\-,.']*$/u

export const emailFormRegex =
  /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

export const numericRegex = /\D/g
