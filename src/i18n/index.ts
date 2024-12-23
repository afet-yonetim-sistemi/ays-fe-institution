import i18n from 'i18next'
import localeTR from './locales/tr.json'
import localeEN from './locales/en.json'
import { languageToUse } from '@/lib/languageDetector'

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
