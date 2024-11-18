'use client'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supportedLanguages } from '@/lib/languageDetector'
import i18next from 'i18next'

function LanguageToggle(): JSX.Element {
  const [lang, setLang] = useState(i18next.language)
  const changeLanguage = (lng: string): void => {
    i18next.changeLanguage(lng).then((r) => r)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lng)
    }
    setLang(lng)
  }
  return (
    <div className="flex gap-2">
      <Select onValueChange={(lng: string) => changeLanguage(lng)} value={lang}>
        <SelectTrigger>
          <SelectValue placeholder={i18next.t(lang)} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lng) => {
            return (
              <SelectItem key={lng} value={lng}>
                {i18next.t(`languages.${lng}`)}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageToggle
