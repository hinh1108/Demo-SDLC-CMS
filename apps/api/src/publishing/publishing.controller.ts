import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Res, UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { PublishingService } from './publishing.service';
import { PublishDto } from './dto/publish.dto';

@Controller()
@UseGuards(JwtGuard)
export class PublishingController {
  constructor(private pub: PublishingService) {}

  // US-14 — xuất bản/lên lịch (RBAC: admin/editor — contributor & manager KHÔNG publish)
  @Post('contents/:id/publication')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  async publish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: PublishDto,
    @CurrentUser() u: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.pub.publish(u.tenantId, id, u.userId, dto);
    res.status(result.scheduled ? 202 : 200); // lên lịch → 202, xuất bản ngay → 200
    return result;
  }

  // US-14 — gỡ xuất bản
  @Delete('contents/:id/publication')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  @HttpCode(204)
  unpublish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.pub.unpublish(u.tenantId, id, u.userId);
  }

  // US-14 — sitemap của site
  @Get('sites/:siteId/sitemap')
  sitemap(@Param('siteId', new ParseUUIDPipe()) siteId: string, @CurrentUser() u: AuthUser) {
    return this.pub.sitemap(u.tenantId, siteId);
  }
}
