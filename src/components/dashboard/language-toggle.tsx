'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const lngs: any = {
  en: { nativeName: 'English' },
  tr: { nativeName: 'Türkçe' },
}

function LanguageToggle() {
  const { i18n } = useTranslation()
  return (
    <div className="flex gap-2">
      <Select onValueChange={(e) => i18n.changeLanguage(e)}>
        <SelectTrigger className="">
          <SelectValue placeholder={lngs[i18n.language].nativeName} />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(lngs).map((lng) => {
            return (
              <SelectItem key={lng} value={lng}>
                {lngs[lng].nativeName}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageToggle
