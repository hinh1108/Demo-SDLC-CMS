import { Controller, Get, HttpCode } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { problem } from '../common/problem';

// Public (không JWT) — dùng cho liveness/readiness probe của K8s/Docker.
@Controller('health')
export class HealthController {
  constructor(private db: DbService) {}

  /** Liveness — process còn sống (không phụ thuộc dependency). */
  @Get()
  @HttpCode(200)
  live() {
    return { status: 'ok', uptime: process.uptime() };
  }

  /** Readiness — sẵn sàng nhận traffic (DB kết nối được). */
  @Get('ready')
  async ready() {
    const ok = await this.db.ping();
    if (!ok) throw problem(503, 'not-ready', 'Not Ready', 'Database unavailable');
    return { status: 'ready', db: 'up' };
  }
}
