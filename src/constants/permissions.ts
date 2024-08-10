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

  //institution
  INSTITUTION = 'institution:page',

  //super
  SUPER = 'super',
}

export const PermissionLabels: Record<Permission, string> = {
  [Permission.ROLE_LIST]: 'role.list.label',
  [Permission.ROLE_DETAIL]: 'role.detail.label',
  [Permission.ROLE_CREATE]: 'role.create.label',
  [Permission.ROLE_UPDATE]: 'role.update.label',
  [Permission.ROLE_DELETE]: 'role.delete.label',
  [Permission.USER_LIST]: 'user.list.label',
  [Permission.USER_DETAIL]: 'user.detail.label',
  [Permission.USER_CREATE]: 'user.create.label',
  [Permission.USER_UPDATE]: 'user.update.label',
  [Permission.USER_DELETE]: 'user.delete.label',
  [Permission.APPLICATION_LIST]: 'application.registration.list.label',
  [Permission.APPLICATION_DETAIL]: 'application.registration.detail.label',
  [Permission.APPLICATION_CREATE]: 'application.registration.create.label',
  [Permission.APPLICATION_CONCLUDE]: 'application.registration.conclude.label',
  [Permission.EVACUATION_LIST]: 'application.evacuation.list.label',
  [Permission.EVACUATION_DETAIL]: 'application.evacuation.detail.label',
  [Permission.EVACUATION_UPDATE]: 'application.evacuation.update.label',
  [Permission.INSTITUTION]: 'institution.page.label',
  [Permission.SUPER]: 'super.label',
};
