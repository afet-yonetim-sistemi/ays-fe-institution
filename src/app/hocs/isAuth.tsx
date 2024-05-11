'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectToken } from '@/modules/auth/authSlice'

const PrivateRoute = ({ children }: any) => {
  const router = useRouter()
  const token = useAppSelector(selectToken)
  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  return children
}

export default PrivateRoute
