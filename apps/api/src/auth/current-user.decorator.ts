import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser { userId: string; tenantId: string; role: string }

export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);
