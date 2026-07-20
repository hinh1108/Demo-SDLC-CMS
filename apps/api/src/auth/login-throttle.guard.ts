import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { problem } from '../common/problem';

// Throttle in-memory theo IP cho /auth/login (chống brute-force).
// MVP: bản Redis sẽ thay ở slice sau (ADR-006).
const WINDOW_MS = 60_000;
const MAX = 10;
const hits = new Map<string, number[]>();

@Injectable()
export class LoginThrottleGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (arr.length >= MAX) {
      throw problem(429, 'rate-limited', 'Too Many Requests', 'Thử lại sau ít phút.');
    }
    arr.push(now);
    hits.set(ip, arr);
    return true;
  }
}
