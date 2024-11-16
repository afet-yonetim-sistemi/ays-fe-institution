const detectLanguage = (): string => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const selectedLanguage = localStorage.getItem('language')
    if (selectedLanguage) return selectedLanguage
    const browserLanguage = navigator.language
    return browserLanguage.split('-')[0]
  }
  return 'en'
}

export const supportedLanguages = ['en', 'tr']
const fallbackLanguage = 'en'

const detectedLanguage = detectLanguage()
export const languageToUse = supportedLanguages.includes(detectedLanguage)
  ? detectedLanguage
  : fallbackLanguage
