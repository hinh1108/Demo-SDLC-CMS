import { Body, Controller, Get, Header, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { SeoService } from './seo.service';
import { PutSeoDto } from './dto/put-seo.dto';

@Controller()
export class SeoController {
  constructor(private seo: SeoService) {}

  @Get('contents/:id/seo')
  @UseGuards(JwtGuard)
  getSeo(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.seo.getSeo(u.tenantId, id);
  }

  @Put('contents/:id/seo')
  @UseGuards(JwtGuard)
  putSeo(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: PutSeoDto,
    @CurrentUser() u: AuthUser,
  ) {
    return this.seo.putSeo(u.tenantId, id, u.userId, dto);
  }

  // PUBLIC — search engine. Không JWT (dữ liệu đã publish là công khai).
  @Get('sites/:siteId/sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  sitemapXml(@Param('siteId', new ParseUUIDPipe()) siteId: string) {
    return this.seo.sitemapXml(siteId);
  }
}
