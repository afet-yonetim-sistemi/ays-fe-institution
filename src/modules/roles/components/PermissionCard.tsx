import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { RolePermission } from '../constants/types'

interface PermissionCardProps {
  category: string
  permissions: RolePermission[]
  isEditable: boolean
  onPermissionToggle: (id: string) => void
  onCategoryToggle: (category: string, isActive: boolean) => void
}

const PermissionCard: React.FC<PermissionCardProps> = ({
  category,
  permissions,
  isEditable,
  onPermissionToggle,
  onCategoryToggle,
}) => {
  const areAllPermissionsActive = permissions.every(
    (permission) => permission.isActive
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span className="mr-4">{category}</span>
          <Switch
            disabled={!isEditable}
            checked={areAllPermissionsActive}
            onCheckedChange={(isActive) => onCategoryToggle(category, isActive)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-1">
          {permissions.map((permission) => (
            <FormItem key={permission.id} className="flex items-center">
              <FormControl>
                <Switch
                  className="mt-2"
                  disabled={!isEditable}
                  checked={permission.isActive}
                  onCheckedChange={() => onPermissionToggle(permission.id)}
                />
              </FormControl>
              <FormLabel className="ml-3 items-center">
                {permission.name}
              </FormLabel>
            </FormItem>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PermissionCard
