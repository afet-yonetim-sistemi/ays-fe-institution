'use client'

import { useEffect, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { handleApiError } from '@/lib/handleApiError'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { CreateUserValidationSchema } from '@/modules/users/constants/formValidationSchema'
import { getRoleSummary } from '@/modules/roles/service'
import { UserRole } from '@/modules/users/constants/types'
import { PhoneInput } from '@/components/ui/phone-input'
import { createUser } from '@/modules/users/service'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(CreateUserValidationSchema),
    mode: 'onChange',
  })
  const { control, watch, formState } = form

  const [roles, setRoles] = useState<UserRole[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [minRoleError, setMinRoleError] = useState<string | null>(null)

  const isCreateDisabled = !formState.isValid || minRoleError !== null

  useEffect(() => {
    getRoleSummary()
      .then((response) => {
        const availableRoles = response.response.map(
          (availableRole: UserRole) => ({
            id: availableRole.id,
            name: availableRole.name,
            isActive: false,
          })
        )
        setRoles(availableRoles)
      })
      .catch((error) => {
        handleApiError(error, { description: t('roleSummaryFetch.error') })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        toast({
          title: t('success'),
          description: t('user.createdSuccessfully'),
          variant: 'success',
        })
        router.push('/users')
      })
      .catch((error) => {
        handleApiError(error, { description: t('user.createError') })
      })
  }

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <Card className="m-3 p-2">
          <CardHeader>
            <CardTitle>{t('user.information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-y-6">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('firstName')}</FormLabel>
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
                    <FormLabel>{t('lastName')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('city')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phoneNumber')}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        onChange={field.onChange}
                        disableCountrySelection={true}
                      />
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
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="m-3 p-2">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle>{t('user.roles')}</CardTitle>
              <div className="ml-4 flex items-center gap-2">
                {minRoleError && (
                  <p className="text-destructive text-sm">{minRoleError}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-1">
              {roles.map((role) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleCreate} disabled={isCreateDisabled}>
        {t('common.create')}
      </Button>
    </Form>
  )
}

export default Page
