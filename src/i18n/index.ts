import { languageToUse } from '@/lib/languageDetector'
import i18n from 'i18next'
import localeEN from './locales/en.json'
import localeTR from './locales/tr.json'

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
  lng: languageToUse,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
