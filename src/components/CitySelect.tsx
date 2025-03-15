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
}

const CitySelect = ({ control }: CitySelectProps) => {
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

  return (
    <FormField
      control={control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('common.city')}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('common.city')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {cityList.map((city) => (
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
