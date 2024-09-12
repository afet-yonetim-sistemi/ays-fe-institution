import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { RolePermission } from '../constants/types'

interface PermissionCardProps {
  category: string
  permissions: RolePermission[]
  isEditable: boolean
  onPermissionToggle: (id: string) => void
}

const PermissionCard: React.FC<PermissionCardProps> = ({
  category,
  permissions,
  isEditable,
  onPermissionToggle,
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{category}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        {permissions.map((permission) => (
          <FormItem key={permission.id} className="flex items-center">
            <FormControl>
              <Switch
                disabled={!isEditable}
                checked={permission.isActive}
                onCheckedChange={() => onPermissionToggle(permission.id)}
              />
            </FormControl>
            <FormLabel className="ml-4">{permission.name}</FormLabel>
          </FormItem>
        ))}
      </div>
    </CardContent>
  </Card>
)

export default PermissionCard
