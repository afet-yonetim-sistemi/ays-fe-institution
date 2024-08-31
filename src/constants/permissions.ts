export enum Permission {
  //role
  ROLE_LIST = 'role:list',
  ROLE_DETAIL = 'role:detail',
  ROLE_CREATE = 'role:create',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',

  //user
  USER_LIST = 'user:list',
  USER_DETAIL = 'user:detail',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  //application-registration
  APPLICATION_LIST = 'application:registration:list',
  APPLICATION_DETAIL = 'application:registration:detail',
  APPLICATION_CREATE = 'application:registration:create',
  APPLICATION_CONCLUDE = 'application:registration:conclude',

  //application-evacuation
  EVACUATION_LIST = 'application:evacuation:list',
  EVACUATION_DETAIL = 'application:evacuation:detail',
  EVACUATION_UPDATE = 'application:evacuation:update',

  //super
  SUPER = 'super',

  //page
  LANDING_PAGE = 'landing:page',
  INSTITUTION_PAGE = 'institution:page',
}

export enum PermissionCategory {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PAGES = 'PAGE',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
  REGISTRATION_APPLICATION_MANAGEMENT = 'REGISTRATION_APPLICATION_MANAGEMENT',
  EVACUATION_APPLICATION_MANAGEMENT = 'EVACUATION_APPLICATION_MANAGEMENT',
}

export const permissionsByCategory: Record<PermissionCategory, Permission[]> = {
  [PermissionCategory.SUPER_ADMIN]: [Permission.SUPER],
  [PermissionCategory.PAGES]: [
    Permission.LANDING_PAGE,
    Permission.INSTITUTION_PAGE,
  ],
  [PermissionCategory.USER_MANAGEMENT]: [
    Permission.USER_LIST,
    Permission.USER_DETAIL,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
  ],
  [PermissionCategory.ROLE_MANAGEMENT]: [
    Permission.ROLE_LIST,
    Permission.ROLE_DETAIL,
    Permission.ROLE_CREATE,
    Permission.ROLE_DELETE,
    Permission.ROLE_UPDATE,
  ],
  [PermissionCategory.REGISTRATION_APPLICATION_MANAGEMENT]: [
    Permission.APPLICATION_LIST,
    Permission.APPLICATION_DETAIL,
    Permission.APPLICATION_CREATE,
    Permission.APPLICATION_CONCLUDE,
  ],
  [PermissionCategory.EVACUATION_APPLICATION_MANAGEMENT]: [
    Permission.EVACUATION_LIST,
    Permission.EVACUATION_DETAIL,
    Permission.EVACUATION_UPDATE,
  ],
}
