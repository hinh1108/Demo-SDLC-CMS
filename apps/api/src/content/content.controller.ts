import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ContentService } from './content.service';
import { ListContentsQuery } from './dto/list-contents.query';

@Controller('sites/:siteId/contents')
@UseGuards(JwtGuard)
export class ContentController {
  constructor(private content: ContentService) {}

  @Get()
  list(
    @Param('siteId', new ParseUUIDPipe()) siteId: string,
    @Query() q: ListContentsQuery,
    @CurrentUser() user: AuthUser, // tenant lấy từ JWT, không từ client
  ) {
    return this.content.list(user.tenantId, siteId, q);
  }
}
