import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { Control, FieldPathByValue, FieldValues } from 'react-hook-form'

interface CitySelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name?: FieldPathByValue<TFieldValues, string | null | undefined>
  defaultValue?: string
  isDisabled?: boolean
}

const CitySelect = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name = 'city' as FieldPathByValue<TFieldValues, string | null | undefined>,
  defaultValue = '',
  isDisabled = false,
}: CitySelectProps<TFieldValues>): React.ReactNode => {
  const [cityList, setCityList] = useState<string[]>([])

  useEffect(() => {
    const fetchCities = async (): Promise<void> => {
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
      name={name}
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
