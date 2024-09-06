'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectToken } from '@/modules/auth/authSlice'
import { useRouter } from 'next/navigation'

export default function Home(): JSX.Element {
  const router = useRouter()

  const tokenInfo = useAppSelector(selectToken)

  useEffect(() => {
    if (!tokenInfo) {
      router.push('/login')
    } else {
      router.push('/dashboard')
    }
  })
  return <></>
}
