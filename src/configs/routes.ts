export const protectedRoutes: Record<string, string> = {
  '/emergency-evacuation-applications': 'application:evacuation:list',
  '/emergency-evacuation-applications/[id]': 'application:evacuation:detail',
  '/admin-registration-applications': 'application:registration:list',
  '/admin-registration-applications/pre-application':
    'application:registration:create',
  '/admin-registration-applications/[id]': 'application:registration:detail',
  '/roles': 'role:list',
  '/roles/create-role': 'role:create',
  '/roles/[id]': 'role:detail',
  '/users': 'user:list',
  '/users/create-user': 'user:create',
  '/users/[id]': 'user:detail',
  '/dashboard': 'institution:page',
}

export const publicRoutes = [
  '/login',
  '/create-password/[id]',
  '/register-completion/[id]',
]
