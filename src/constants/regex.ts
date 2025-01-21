export const emailRegex = new RegExp(
  '^(?!.*\\.{2}|.*--|.*-@|.*@\\.|.*\\.-|.*-\\.)' +
    '[A-Za-z0-9][A-Za-z0-9._%+\\-]*' +
    '@' +
    '(?!-)(?:[A-Za-z0-9-]+(?<!-)\\.)+' +
    '[A-Za-z]{2,}$'
) // NOSONAR -> typescript:S5843
