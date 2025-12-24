export const protectedRoutes: Record<string, string> = {
  '/emergency-evacuation-applications': 'application:evacuation:list',
  '/emergency-evacuation-applications/details': 'application:evacuation:detail',
  '/admin-registration-applications': 'application:registration:list',
  '/admin-registration-applications/pre-application':
    'application:registration:create',
  '/admin-registration-applications/details': 'application:registration:detail',
  '/roles': 'role:list',
  '/roles/create-role': 'role:create',
  '/roles/details': 'role:detail',
  '/users': 'user:list',
  '/users/create-user': 'user:create',
  '/users/details': 'user:detail',
  '/dashboard': 'institution:page',
}

export const publicRoutes = [
  '/login',
  '/create-password',
  '/register-completion',
]
