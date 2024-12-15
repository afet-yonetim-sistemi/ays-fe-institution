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
// import {
//   getLocalizedCategory,
//   getLocalizedPermission,
// } from '@/lib/localizePermission'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { useTranslation } from 'react-i18next'
// import { Switch } from '@/components/ui/switch'
// import { useToast } from '@/components/ui/use-toast'
// import { useRouter } from 'next/navigation'
// import { CreateUserValidationSchema } from '@/modules/users/constants/formValidationSchema'

// const Page = (): JSX.Element => {
//   const { t } = useTranslation()
//   const { toast } = useToast()
//   const router = useRouter()
//   const form = useForm({
//     resolver: zodResolver(CreateUserValidationSchema),
//     mode: 'onChange',
//   })
//   const { control, watch, formState } = form

//   const isSaveDisabled = !formState.isValid

//   useEffect(() => {
//     getPermissions()
//       .then((response) => {
//         const permissions = response.response.map(
//           (permission: RolePermission) => ({
//             id: permission.id,
//             name: permission.name,
//             category: permission.category,
//             isActive: false,
//           })
//         )
//         const localizedPermissions = permissions.map((permission) => ({
//           ...permission,
//           name: getLocalizedPermission(permission.name, t),
//           category: getLocalizedCategory(permission.category, t),
//         }))
//         setRolePermissions(localizedPermissions)
//       })
//       .catch((error) => {
//         handleApiError(error, { description: t('permissions.error') })
//       })
//   }, [t])

//   useEffect(() => {
//     if (rolePermissions.length > 0) {
//       const allActive = rolePermissions.every(
//         (permission) => permission.isActive
//       )
//       const allInactive = rolePermissions.every(
//         (permission) => !permission.isActive
//       )

//       setMasterPermissionsSwitch(allActive)
//       setMinPermissionError(allInactive ? t('role.minPermissionError') : null)
//     }
//   }, [rolePermissions, t])

//   const handleMasterSwitchChange = (isActive: boolean): void => {
//     setMasterPermissionsSwitch(isActive)
//     setRolePermissions((prevPermissions) =>
//       prevPermissions.map((permission) => ({
//         ...permission,
//         isActive,
//       }))
//     )
//   }

//   const categorizePermissions = (
//     permissions: RolePermission[]
//   ): Record<string, RolePermission[]> => {
//     return permissions.reduce<Record<string, RolePermission[]>>(
//       (acc, permission) => {
//         if (!acc[permission.category]) {
//           acc[permission.category] = []
//         }
//         acc[permission.category].push(permission)
//         return acc
//       },
//       {}
//     )
//   }

//   const handlePermissionToggle = (id: string): void => {
//     setRolePermissions((prevPermissions) =>
//       prevPermissions.map((permission) =>
//         permission.id === id
//           ? { ...permission, isActive: !permission.isActive }
//           : permission
//       )
//     )
//   }

//   const handleCategoryToggle = (category: string, isActive: boolean): void => {
//     setRolePermissions((prevPermissions) =>
//       prevPermissions.map((permission) =>
//         permission.category === category
//           ? { ...permission, isActive }
//           : permission
//       )
//     )
//   }

//   const handleSave = (): void => {
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
