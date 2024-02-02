import { components, paths } from "./OpenAPITypes";

/**
 * Refresh Token Types
 */
export type RefreshTokenPath = paths["/api/v1/authentication/admin/token/refresh"]["post"];
export type RefreshTokenResponse = RefreshTokenPath["responses"]["200"]["content"]["*/*"];

/**
 * Admin Login Types
 */
export type AdminTokenPath = paths["/api/v1/authentication/admin/token"]["post"];
export type AdminTokenResponse = AdminTokenPath["responses"]["200"]["content"]["*/*"];
export type UserTypes = "ADMIN" | "SUPER_ADMIN" | "GUEST";

/**
 * Admin Invalidate Types
 */

export type AdminInvalidatePath = paths["/api/v1/authentication/admin/token/invalidate"]["post"];
export type AdminInvalidateResponse = AdminInvalidatePath["responses"]["200"]["content"]["*/*"];

/**
 * Sort and Pagination Types
 */
export type Sorter = components["schemas"]["AysSorting"];
export type Sorters = Sorter[];
export type Pagination = components["schemas"]["AysPaging"];

/**
 * User Types
 */
export type UserListRequest = components["schemas"]["UserListRequest"];
export type User = components["schemas"]["UsersResponse"];
export type SingleUser = components["schemas"]["UserResponse"];
export type CreateUserRequest = components["schemas"]["UserSaveRequest"];
export type CreateUserResponse = components["schemas"]["UserSavedResponse"];

/**
 * Admin Types
 */
export type AdminListRequest = components["schemas"]["AdminUserListRequest"];
export type Admin = components["schemas"]["AdminUsersResponse"];
export type CreateAdminRequest = components["schemas"]["AdminUserListRequest"];

/**
 * Assignments Types
 */
export type Assignment = components["schemas"]["AssignmentResponse"] & {
  user: {
    location: {
      latitude: number;
      longitude: number;
    };
  };
};
export type SingleAssignment = components["schemas"]["AssignmentResponse"] & {
  user: {
    location: {
      latitude: number;
      longitude: number;
    };
  };
};
export type CreateAssignmentResponse = components["schemas"]["AssignmentSaveRequest"];

/**
 * App Version Types
 *
 */
export type AppVersion = {
  application: {
    name: string;
    description: string;
    version: string;
  };
};

/**
 * Token Types
 */
export interface TokenPayload {
  jti: string;
  iss: string;
  iat: number;
  exp: number;
  institutionId: string;
  userLastName: string;
  institutionName: string;
  userType: string;
  userFirstName: string;
  userId: string;
  username: string;
}

/**
 * Institution Types
 */
export type Institution = components["schemas"]["InstitutionResponse"];
