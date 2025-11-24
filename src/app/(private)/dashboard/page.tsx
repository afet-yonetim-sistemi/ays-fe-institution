'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/dataFormatters'
import { selectUser } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { CalendarCheck, Landmark, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const user = useAppSelector(selectUser)

  const infoItems = user
    ? [
        {
          Icon: User,
          label: 'common.fullName',
          value: `${user.userFirstName} ${user.userLastName}`,
        },
        {
          Icon: Landmark,
          label: 'common.institution',
          value: user.institutionName,
        },
        {
          Icon: CalendarCheck,
          label: 'common.lastSuccessfulLoginAt',
          value: formatDateTime(user.userLastLoginAt),
        },
      ]
    : []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-medium">
          {t('dashboard.title', { ays: t('common.AYS') })}
        </h1>
        <p className="text-gray-500 font-medium">
          {t('dashboard.description')}
        </p>
      </div>
      {user && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3">
              {infoItems.map(({ Icon, label, value }) => (
                <div className="flex gap-1.5" key={label}>
                  <span>
                    <Icon />
                  </span>
                  <span className="font-semibold">{t(label)}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
export default Page
