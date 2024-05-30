import i18n from 'i18next'
import localeTR from './locales/tr.json'
import localeEN from './locales/en.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  tr: {
    translation: localeTR,
  },
  en: {
    translation: localeEN,
  },
}

i18n.init({
  resources,
  lng:
    typeof window !== 'undefined'
      ? localStorage.getItem('language') || 'tr'
      : 'tr', // Check localStorage for saved language
  // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
  // if you're using a language detector, do not define the lng option

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng)
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng)
  }
}

export default i18n
