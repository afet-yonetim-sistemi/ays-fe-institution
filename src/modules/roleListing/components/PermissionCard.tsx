import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RolePermission } from '../constants/types'
import { Switch } from '@/components/ui/switch'

interface PermissionCardProps {
  category: string
  permissions: RolePermission[]
  isChecked: boolean
}

export default function PermissionCard({
  category,
  permissions,
  isChecked,
}: PermissionCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center">
              <Switch id={permission.id} checked={isChecked} disabled />
              <label htmlFor={permission.id} className="ml-2">
                {permission.name}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
