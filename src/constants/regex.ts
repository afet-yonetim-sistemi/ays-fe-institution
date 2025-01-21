export const emailRegex = new RegExp(
  '^(?!.*\\.{2})' +
    '[\\p{L}\\p{N}][\\p{L}\\p{N}._%+\\-]*' +
    '@' +
    '(?!-)(?:[\\p{L}\\p{N}]+(?<!-)\\.)+' +
    '[\\p{L}]{2,}$',
  'u'
)
