'use client'

import CitySelect from '@/components/CitySelect'
import PhoneNumberField from '@/components/PhoneNumberField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Switch } from '@/components/ui/switch'
import useFetchRoleSummary from '@/hooks/useFetchRoleSummary'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { userFormConfig } from '@/modules/users/constants/formConfig'
import { createUser } from '@/modules/users/service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(userFormConfig.validationSchemeCreate),
    mode: 'onChange',
  })
  const { control, watch, formState } = form

  const { roles, userRolesIsLoading } = useFetchRoleSummary()
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [minRoleError, setMinRoleError] = useState<string | null>(null)

  const isCreateDisabled = !formState.isValid || minRoleError !== null

  useEffect(() => {
    if (selectedRoles.length === 0) {
      setMinRoleError(t('user.minRoleError'))
    } else {
      setMinRoleError(null)
    }
  }, [selectedRoles, t])

  const handleRoleToggle = (id: string): void => {
    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(id)) {
        return prevSelectedRoles.filter((roleId) => roleId !== id)
      }
      return [...prevSelectedRoles, id]
    })
  }

  const handleCreate = (): void => {
    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const emailAddress = watch('emailAddress')
    const phoneNumber = watch('phoneNumber')
    const city = watch('city')

    const payload = {
      firstName,
      lastName,
      emailAddress,
      phoneNumber: {
        countryCode: phoneNumber.countryCode,
        lineNumber: phoneNumber.lineNumber,
      },
      city,
      roleIds: selectedRoles,
    }

    createUser(payload)
      .then(() => {
        showSuccessToast('user.createSuccess')
        router.push('/users')
      })
      .catch((error) => {
        showErrorToast(error, 'user.createError')
      })
  }

  return (
    <Form {...form}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('user.createTitle')}</h1>
        <Button onClick={handleCreate} disabled={isCreateDisabled}>
          {t('common.create')}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('user.information')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.firstName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.lastName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('user.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PhoneNumberField control={control} />

            <CitySelect control={control} />
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CardTitle>{t('user.role2')}</CardTitle>
              <div className="ml-4 flex items-center gap-2">
                {minRoleError && (
                  <p className="text-sm text-destructive">{minRoleError}</p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-1">
            {userRolesIsLoading ? (
              <LoadingSpinner />
            ) : (
              roles.map((role) => (
                <FormItem key={role.id} className="flex items-center">
                  <FormControl>
                    <Switch
                      className="mt-2"
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                  </FormControl>
                  <FormLabel className="ml-3 items-center">
                    {role.name}
                  </FormLabel>
                </FormItem>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Form>
  )
}

export default Page
