'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

import { supportedLanguages } from '@/lib/languageDetector'
import i18next from 'i18next'
import { useState } from 'react'

function LanguageToggle(): JSX.Element {
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language)
  const changeLanguage = (language: string): void => {
    i18next.changeLanguage(language)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
    setSelectedLanguage(language)
  }
  return (
    <div className="flex gap-2">
      <Select
        onValueChange={(language: string) => changeLanguage(language)}
        value={selectedLanguage}
      >
        <SelectTrigger>
          <SelectValue placeholder={i18next.t(selectedLanguage)} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((language) => {
            return (
              <SelectItem key={language} value={language}>
                {i18next.t(`languages.${language}`)}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageToggle
