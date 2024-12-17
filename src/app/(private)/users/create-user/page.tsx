// 'use client'

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { handleApiError } from '@/lib/handleApiError'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { useTranslation } from 'react-i18next'
// import { Switch } from '@/components/ui/switch'
// import { useToast } from '@/components/ui/use-toast'
// import { useRouter } from 'next/navigation'
// import { CreateUserValidationSchema } from '@/modules/users/constants/formValidationSchema'
// import { getRoleSummary } from '@/modules/roles/service'
// import { UserRole } from '@/modules/users/constants/types'
// import { PhoneInput } from '@/components/ui/phone-input'

// const Page = (): JSX.Element => {
//   const { t } = useTranslation()
//   const { toast } = useToast()
//   const router = useRouter()
//   const form = useForm({
//     resolver: zodResolver(CreateUserValidationSchema),
//     mode: 'onChange',
//   })
//   const { control, watch, formState } = form

//   const [roles, setRoles] = useState<UserRole[]>([])
//   const [selectedRoles, setSelectedRoles] = useState<string[]>([])

//   const isCreateDisabled = !formState.isValid

//   useEffect(() => {
//     getRoleSummary()
//       .then((response) => {
//         const availableRoles = response.response.map(
//           (availableRole: UserRole) => ({
//             id: availableRole.id,
//             name: availableRole.name,
//             isActive: false,
//           })
//         )
//         setRoles(availableRoles)
//       })
//       .catch((error) => {
//         handleApiError(error, { description: t('roleSummaryFetch.error') })
//       })
//   }, [t])

//   const handleRoleToggle = (id: string): void => {
//     setSelectedRoles((prevSelectedRoles) => {
//       if (prevSelectedRoles.includes(id)) {
//         // Remove the role ID if it's already selected
//         return prevSelectedRoles.filter((roleId) => roleId !== id)
//       }
//       return [...prevSelectedRoles, id]
//     })
//   }

//   const handleCreate = (): void => {
//     console.log('selected roles IDs', selectedRoles)
//   }

//   return (
//     <Form {...form}>
//       <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
//         <Card className="m-3 p-2">
//           <CardHeader>
//             <CardTitle>{t('user.information')}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 gap-y-6">
//               <FormField
//                 control={control}
//                 name="firstName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('firstName')}</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={control}
//                 name="lastName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('lastName')}</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={control}
//                 name="city"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('city')}</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('phoneNumber')}</FormLabel>
//                     <FormControl>
//                       <PhoneInput
//                         onChange={field.onChange}
//                         disableCountrySelection={true}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={control}
//                 name="emailAddress"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('email')}</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="m-3 p-2">
//           <CardHeader>
//             <CardTitle>{t('user.roles')}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 gap-1">
//               {roles.map((role) => (
//                 <FormItem key={role.id} className="flex items-center">
//                   <FormControl>
//                     <Switch
//                       className="mt-2"
//                       checked={selectedRoles.includes(role.id)}
//                       onCheckedChange={() => handleRoleToggle(role.id)}
//                     />
//                   </FormControl>
//                   <FormLabel className="ml-3 items-center">
//                     {role.name}
//                   </FormLabel>
//                 </FormItem>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <Button onClick={handleCreate} disabled={false}>
//         {t('common.create')}
//       </Button>
//     </Form>
//   )
// }

// export default Page
