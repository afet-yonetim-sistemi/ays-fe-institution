import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { RolePermission } from '../constants/types'

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
              <FormLabel className="ml-4">{permission.name}</FormLabel>
            </FormItem>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
