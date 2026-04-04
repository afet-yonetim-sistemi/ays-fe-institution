import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Label } from '@/shadcn/ui/label'
import { Switch } from '@/shadcn/ui/switch'
import React from 'react'
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
        <CardTitle className="flex items-center text-lg">
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
            <div
              key={permission.id}
              className="flex items-center space-x-3 space-y-0"
            >
              <Switch
                className="mt-2"
                disabled={!isEditable}
                checked={permission.isActive}
                onCheckedChange={() => onPermissionToggle(permission.id)}
              />
              <Label className="items-center font-normal">
                {permission.name}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PermissionCard
