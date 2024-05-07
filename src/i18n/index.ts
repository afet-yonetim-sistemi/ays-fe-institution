import i18n from 'i18next'
import localeTR from './locales/tr.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    tr: {
        translation: localeTR,
    },
}

i18n.init({
    resources,
    lng: 'tr', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
        escapeValue: false, // react already safes from xss
    },
})

export default i18n
