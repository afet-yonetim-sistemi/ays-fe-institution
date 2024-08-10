import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RolePermission, RolePermissionWithLabel } from '../constants/types'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'

interface PermissionCardProps {
  category: string
  permissions: RolePermissionWithLabel[]
  isChecked: boolean
}

export default function PermissionCard({
  category,
  permissions,
  isChecked,
}: PermissionCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-y-6 grid-cols-1">
          {permissions.map((permission) => (
            <FormItem key={permission.id}>
              <FormControl>
                <Switch disabled checked={isChecked} />
              </FormControl>
              <FormLabel className="ml-4">{permission.label}</FormLabel>
            </FormItem>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
