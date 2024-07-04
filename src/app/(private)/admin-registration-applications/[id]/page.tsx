'use client'

import { useEffect, useState } from 'react'
import { getAdminRegistrationApplication } from '@/modules/adminRegistrationApplications/service'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { AdminRegistrationApplication } from '../types'
import { formatDate } from '@/app/hocs/formatDate'
import Status from '@/modules/adminRegistrationApplications/components/status'

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const [
    adminRegistrationApplicationDetails,
    setAdminRegistrationApplicationDetails,
  ] = useState<AdminRegistrationApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchDetails = () => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          console.log(response)
          if (response.data.isSuccess) {
            console.log(response.data.response)
            setAdminRegistrationApplicationDetails(response.data.response)
          } else {
            setError(new Error('Failed to fetch data'))
          }
          setLoading(false)
        })
        .catch((err) => {
          setError(err)
          setLoading(false)
        })
    }
    fetchDetails()
  }, [params.id])

  const renderInput = (label: string, value: string | number | null) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <Input value={value ?? ''} disabled className="mt-1 block w-full" />
    </div>
  )

  const renderPhoneInput = (countryCode: string, lineNumber: string) => {
    if (countryCode && lineNumber) {
      return (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-500">
            Phone Number
          </label>
          <Input
            value={`(+${countryCode}) ${lineNumber}`}
            disabled
            className="mt-1 block w-full"
          />
        </div>
      )
    } else {
      return (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-500">
            Phone Number
          </label>
          <Input value="" disabled className="mt-1 block w-full" />
        </div>
      )
    }
  }

  return (
    <div className="form-container p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && adminRegistrationApplicationDetails && (
        <form className="space-y-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-1">
              Institution ID:{' '}
              {adminRegistrationApplicationDetails.institution?.id}
            </h1>
            <div className="text-m text-gray-250 space-x-6">
              <span>
                Created User: {adminRegistrationApplicationDetails.createdUser}
              </span>
              <span>
                Created At:{' '}
                {formatDate(adminRegistrationApplicationDetails.createdAt)}
              </span>
              <span>
                Status:{' '}
                <Status status={adminRegistrationApplicationDetails.status} />
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
            {renderInput(
              'Updated User',
              adminRegistrationApplicationDetails.updatedUser,
            )}
            {renderInput(
              'Updated At',
              adminRegistrationApplicationDetails.updatedAt,
            )}
            {renderInput('ID', adminRegistrationApplicationDetails.id)}
            {renderInput('Reason', adminRegistrationApplicationDetails.reason)}
            {renderInput(
              'Reject Reason',
              adminRegistrationApplicationDetails.rejectReason,
            )}
            {renderInput(
              'Institution Name',
              adminRegistrationApplicationDetails.institution?.name,
            )}
            {renderInput(
              'User ID',
              adminRegistrationApplicationDetails.user?.id,
            )}
            {renderInput(
              'User First Name',
              adminRegistrationApplicationDetails.user?.firstName,
            )}
            {renderInput(
              'User Last Name',
              adminRegistrationApplicationDetails.user?.lastName,
            )}
            {renderInput(
              'User City',
              adminRegistrationApplicationDetails.user?.city,
            )}
            {renderInput(
              'User Email Address',
              adminRegistrationApplicationDetails.user?.emailAddress,
            )}
            {renderPhoneInput(
              adminRegistrationApplicationDetails.user?.phoneNumber
                ?.countryCode ?? '',
              adminRegistrationApplicationDetails.user?.phoneNumber
                ?.lineNumber ?? '',
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default Page
