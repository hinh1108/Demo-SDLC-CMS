import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/** Yêu cầu vai trò cho một route (RBAC). Vd @Roles('manager','admin'). */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
