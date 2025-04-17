import { useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { t } from 'i18next'

interface CitySelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  defaultValue?: string
  isDisabled?: boolean
}

const CitySelect = ({
  control,
  defaultValue = '',
  isDisabled = false,
}: CitySelectProps) => {
  const [cityList, setCityList] = useState<string[]>([])

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch('/turkey_cities_districts.json')
        const data = await res.json()
        const cities = data.map((city: { name: string }) => city.name)
        setCityList(cities)
      } catch (error) {
        console.error('Failed to load cities:', error)
      }
    }

    fetchCities()
  }, [])

  const citiesToShow =
    defaultValue && !cityList.includes(defaultValue)
      ? [defaultValue, ...cityList]
      : cityList

  return (
    <FormField
      control={control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('user.city')}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || defaultValue}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('user.city')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {citiesToShow.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CitySelect
