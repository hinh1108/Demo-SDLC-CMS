import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { Unauthorized } from '../common/problem';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const h = req.headers['authorization'] as string | undefined;
    if (!h || !h.startsWith('Bearer ')) throw Unauthorized('Thiếu token.');
    try {
      const payload = jwt.verify(h.slice(7), config.jwtSecret) as any;
      // tenant LẤY TỪ TOKEN (đã ký server), không nhận từ client body/param
      req.user = { userId: payload.sub, tenantId: payload.tenant_id, role: payload.role };
      return true;
    } catch {
      throw Unauthorized('Token không hợp lệ hoặc đã hết hạn.');
    }
  }
}
