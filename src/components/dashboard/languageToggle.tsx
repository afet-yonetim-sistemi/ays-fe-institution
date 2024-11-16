'use client'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { changeLanguage } from '@/i18n'
import { supportedLanguages } from '@/lib/languageDetector'
import i18next from 'i18next'

function LanguageToggle(): JSX.Element {
  return (
    <div className="flex gap-2">
      <Select
        onValueChange={(lng: string) => changeLanguage(lng)}
        value={i18next.language}
      >
        <SelectTrigger>
          <SelectValue placeholder={i18next.t(i18next.language)} />
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
