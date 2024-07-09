'use client'

import { useEffect, useState } from 'react'
import { getAdminRegistrationApplication } from '@/modules/adminRegistrationApplications/service'
import { Input } from '@/components/ui/input'
import { AdminRegistrationApplication } from '../../../../modules/adminRegistrationApplications/constants/types'
import { formatDate } from '@/app/hocs/formatDate'
import Status from '@/modules/adminRegistrationApplications/components/status'
import { FormItem, FormField, FormControl, FormLabel, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from '@/modules/adminRegistrationApplications/constants/formSchema'

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  })
  const { control } = form

  const [adminRegistrationApplicationDetails, setAdminRegistrationApplicationDetails] = useState<AdminRegistrationApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchDetails = () => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          if (response.data.isSuccess) {
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

  return (
    <div className="form-container p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && adminRegistrationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-4">
            <div className="mb-6">
              <h1 className="text-xl font-bold mb-1">
                Institution ID: {adminRegistrationApplicationDetails.institution?.id}
              </h1>
              <div className="text-m text-gray-250 space-x-6">
                <span>Created User: {adminRegistrationApplicationDetails.createdUser}</span>
                <span>Created At: {formatDate(adminRegistrationApplicationDetails.createdAt)}</span>
                <span>Status: <Status status={adminRegistrationApplicationDetails.status} /></span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
              <FormField
                control={control}
                name="updatedUser"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Updated User</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.updatedUser ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="updatedAt"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Updated At</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.updatedAt ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="id"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.id ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.reason ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="rejectReason"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Reject Reason</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.rejectReason ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="institutionName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.institution?.name ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.user?.id ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="userFirstName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>User First Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.user?.firstName ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="userLastName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>User Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.user?.lastName ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="userCity"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>User City</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.user?.city ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="userEmailAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>User Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled defaultValue={adminRegistrationApplicationDetails.user?.emailAddress ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        defaultValue={
                          adminRegistrationApplicationDetails.user?.phoneNumber?.countryCode &&
                          adminRegistrationApplicationDetails.user?.phoneNumber?.lineNumber
                            ? `(+${adminRegistrationApplicationDetails.user.phoneNumber.countryCode}) ${adminRegistrationApplicationDetails.user.phoneNumber.lineNumber}`
                            : ''
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default Page
