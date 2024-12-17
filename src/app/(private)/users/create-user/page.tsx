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
//   const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])

//   const isSaveDisabled = !formState.isValid

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

//   const handleRoleToggle = (id: string): void => {}

//   const handleCreate = (): void => {
//     const name = watch('name')
//     const activePermissionIds = rolePermissions
//       .filter((permission) => permission.isActive)
//       .map((permission) => permission.id)

//     if (activePermissionIds.length === 0) {
//       setMinPermissionError(t('role.minPermissionError'))
//       return
//     }

//     createRole({ name, permissionIds: activePermissionIds })
//       .then(() => {
//         toast({
//           title: t('success'),
//           description: t('role.createdSuccessfully'),
//           variant: 'success',
//         })
//         router.push('/roles')
//       })
//       .catch((error) => {
//         handleApiError(error, { description: t('role.createError') })
//       })
//   }

//   return (
//     <Form {...form}>
//       <FormField
//         control={control}
//         name="name"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>{t('name')}</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <CardTitle>{t('role.permissions')}</CardTitle>
//               <div className="ml-4 flex items-center gap-2">
//                 <Switch
//                   checked={masterPermissionsSwitch}
//                   onCheckedChange={(isActive) =>
//                     handleMasterSwitchChange(isActive)
//                   }
//                 />
//                 {minPermissionError && (
//                   <p className="text-destructive text-sm">
//                     {minPermissionError}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <Button onClick={handleSave} disabled={isSaveDisabled}>
//               {t('common.save')}
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(categorizePermissions(rolePermissions)).map(
//               ([category, permissions]) => (
//                 <PermissionCard
//                   key={category}
//                   category={category}
//                   permissions={permissions}
//                   isEditable={true}
//                   onPermissionToggle={handlePermissionToggle}
//                   onCategoryToggle={handleCategoryToggle}
//                 />
//               )
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </Form>
//   )
// }

// export default Page
