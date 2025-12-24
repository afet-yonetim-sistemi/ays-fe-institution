'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui'

const NotFound = (): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className={'container'}>
      <Image src={'/aysfavicon360.png'} alt={'AYS'} width={150} height={150} />
      <h1 className={'mt-5'}>{t('notFound.title')}</h1>
      <Button onClick={() => router.push('/dashboard')} className={'mt-5'}>
        {t('common.home')}
      </Button>
    </div>
  )
}

export default NotFound
