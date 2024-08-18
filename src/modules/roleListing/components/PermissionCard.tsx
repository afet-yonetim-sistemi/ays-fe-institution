import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { RolePermission } from '../constants/types'

interface PermissionCardProps {
  category: string
  permissions: RolePermission[]
}

export default function PermissionCard({
  category,
  permissions,
}: PermissionCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {permissions.map((permission) => (
            <FormItem key={permission.id}>
              <FormControl>
                <Switch disabled checked={permission.isActive} />
              </FormControl>
              <FormLabel className="ml-4">{permission.name}</FormLabel>
            </FormItem>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
