const supportedLanguages = ['en', 'tr']
const fallbackLanguage = 'en'

const detectLanguage = (): string => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const selectedLanguage = localStorage.getItem('language')
    if (selectedLanguage) return selectedLanguage
    const browserLanguage = navigator.language
    return browserLanguage.split('-')[0]
  }
  return 'en'
}

const detectedLanguage = detectLanguage()
const languageToUse = supportedLanguages.includes(detectedLanguage)
  ? detectedLanguage
  : fallbackLanguage

export { languageToUse, supportedLanguages }
