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
