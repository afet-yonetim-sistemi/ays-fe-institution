import { Permission, PermissionCategory } from '@/constants/permissions'

const permissionCategoryMap: Record<PermissionCategory, string> = {
  [PermissionCategory.SUPER_ADMIN]: 'superAdmin',
  [PermissionCategory.PAGES]: 'pages',
  [PermissionCategory.USER_MANAGEMENT]: 'userManagement',
  [PermissionCategory.ROLE_MANAGEMENT]: 'roleManagement',
  [PermissionCategory.REGISTRATION_APPLICATION_MANAGEMENT]:
    'registrationApplicationManagement',
  [PermissionCategory.EVACUATION_APPLICATION_MANAGEMENT]:
    'evacuationApplicationManagement',
}

const permissionMap: Record<Permission, string> = {
  [Permission.SUPER]: 'super',
  [Permission.LANDING_PAGE]: 'landingPage',
  [Permission.INSTITUTION_PAGE]: 'institutionPage',
  [Permission.USER_LIST]: 'userList',
  [Permission.USER_DETAIL]: 'userDetail',
  [Permission.USER_CREATE]: 'userCreate',
  [Permission.USER_UPDATE]: 'userUpdate',
  [Permission.USER_DELETE]: 'userDelete',
  [Permission.ROLE_LIST]: 'roleList',
  [Permission.ROLE_DETAIL]: 'roleDetail',
  [Permission.ROLE_CREATE]: 'roleCreate',
  [Permission.ROLE_UPDATE]: 'roleUpdate',
  [Permission.ROLE_DELETE]: 'roleDelete',
  [Permission.APPLICATION_LIST]: 'applicationRegistrationList',
  [Permission.APPLICATION_DETAIL]: 'applicationRegistrationDetail',
  [Permission.APPLICATION_CREATE]: 'applicationRegistrationCreate',
  [Permission.APPLICATION_CONCLUDE]: 'applicationRegistrationConclude',
  [Permission.EVACUATION_LIST]: 'applicationEvacuationList',
  [Permission.EVACUATION_DETAIL]: 'applicationEvacuationDetail',
  [Permission.EVACUATION_UPDATE]: 'applicationEvacuationUpdate',
}

export const getLocalizedCategory = (
  category: string,
  t: (key: string) => string
): string => {
  const key = permissionCategoryMap[category as PermissionCategory]
  return t(`permissions.${key}`)
}

export const getLocalizedPermission = (
  permission: string,
  t: (key: string) => string
): string => {
  const key = permissionMap[permission as Permission]
  return t(`permissions.${key}`)
}
