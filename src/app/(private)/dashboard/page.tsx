'use client'

import UserInfoCard from '@/components/dashboard/UserInfoCard'
import { selectUser } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { useTranslation } from 'react-i18next'

const Page = (): React.ReactNode => {
  const { t } = useTranslation()
  const user = useAppSelector(selectUser)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-medium">
          {t('dashboard.title', { ays: t('common.AYS') })}
        </h1>
        <p className="font-medium text-gray-500">
          {t('dashboard.description')}
        </p>
      </div>
      <UserInfoCard userInfo={user} />
    </div>
  )
}
export default Page
