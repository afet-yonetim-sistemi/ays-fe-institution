export const emailRegex = new RegExp(
  '^(?!.*\\.{2})' +
    '[\\p{L}\\p{N}][\\p{L}\\p{N}._%+\\-]*' +
    '@' +
    '(?!-)(?:[\\p{L}\\p{N}]+(?<!-)\\.)+' +
    '\\p{L}{2,}$',
  'u'
)

export const nameRegex =
  /^(?! )(?!.* {2})(?!.*[.\-][.\-])(?=.*\p{L})[\p{L} .\-]+(?<! )$/u

export const locationRegex = /^(?! )(?!.* {2})(?!.*[-.][-.])[-\p{L}. ]+(?<! )$/u

export const numericRegex = /\D/g
