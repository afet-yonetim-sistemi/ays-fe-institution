'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/dataFormatters'
import { UserInfo } from '@/modules/auth/constants/types'
import { CalendarCheck, Landmark, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserInfoCardProps {
  userInfo: UserInfo | null
}

const UserInfoCard = ({ userInfo }: UserInfoCardProps): JSX.Element | null => {
  const { t } = useTranslation()

  if (!userInfo) return null

  const userInfoItems = [
    {
      Icon: User,
      label: 'common.fullName',
      value: `${userInfo.userFirstName} ${userInfo.userLastName}`,
    },
    {
      Icon: Landmark,
      label: 'common.institution',
      value: userInfo.institutionName,
    },
    {
      Icon: CalendarCheck,
      label: 'common.lastSuccessfulLoginAt',
      value: formatDateTime(userInfo.userLastLoginAt),
    },
  ]

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          {userInfoItems.map(({ Icon, label, value }) => (
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
  )
}

export default UserInfoCard
