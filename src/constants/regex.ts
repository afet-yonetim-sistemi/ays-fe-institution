export const nameFormRegex = /^(?! )[a-zA-ZçÇğĞıİöÖşŞüÜ ,.'-]+(?<! )$/u
export const nameFilterRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ ,.'-]*$/u

export const roleFormRegex = /^(?! )[a-zA-ZçÇğĞıİöÖşŞüÜ0-9 /&|_\-,.']+(?<! )$/u
export const roleFilterRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9 /&|_\-,.']*$/u

export const emailFormRegex =
  /^(?!.*\.{2}|.*--|.*-@|.*@\.|.*\.-|.*-\.)[A-Za-z0-9][A-Za-z0-9._%+\-]*@(?!-)(?:[A-Za-z0-9-]+(?<!-)\.)+[A-Za-z]{2,}$/

export const numericRegex = /\D/g
