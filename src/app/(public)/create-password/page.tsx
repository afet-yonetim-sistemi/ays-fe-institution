/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client'

import CreatePasswordCard from '@/components/password/CreatePasswordCard'
import { LoadingSpinner } from '@/components/ui'
import passwordService from '@/modules/password/service'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const PageContent = (): JSX.Element => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') as string

  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (!id) {
      router.replace('/not-found')
      return
    }

    passwordService
      .validatePasswordId(id)
      .then(() => {
        setIsValid(true)
      })
      .catch(() => {
        router.replace('/not-found')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [id, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isValid) {
    return <LoadingSpinner /> // Should have redirected
  }

  return <CreatePasswordCard id={id} />
}

const Page = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <PageContent />
  </Suspense>
)

export default Page
