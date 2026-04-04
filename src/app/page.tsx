'use client'

import { selectToken } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home(): React.ReactNode {
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
