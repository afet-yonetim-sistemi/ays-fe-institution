import React, { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import i18next from 'i18next'
import { useDebounce } from '@/app/hocs/useDebounce'

const FilterInput = ({ param }: { param: string }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initialValue = searchParams.get(param)
  const [city, setCity] = useState(initialValue || '')
  const debouncedCity = useDebounce(city, 500)

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (debouncedCity) {
      newSearchParams.set(param, debouncedCity)
    } else {
      newSearchParams.delete(param)
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false
    })
  }, [debouncedCity])
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.currentTarget.value)
  }, [])
  return (
    <div className="relative">
      <Input
        id={param}
        placeholder=""
        value={city}
        onChange={handleInputChange}
        className="block focus-visible:ring-0 focus-visible:ring-offset-0 p-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-[2px] border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
      <Label
        htmlFor={param}
        className="absolute !left-3 rounded cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-1.5 z-10 origin-[0] bg-white dark:bg-background peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1.5 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {i18next.t(param)}
      </Label>
    </div>
  )
}

export default FilterInput