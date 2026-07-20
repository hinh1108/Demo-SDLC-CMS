import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ContentService } from './content.service';
import { ListContentsQuery } from './dto/list-contents.query';
import { CreateContentDto } from './dto/create-content.dto';

@Controller('sites/:siteId/contents')
@UseGuards(JwtGuard)
export class ContentController {
  constructor(private content: ContentService) {}

  @Get()
  list(
    @Param('siteId', new ParseUUIDPipe()) siteId: string,
    @Query() q: ListContentsQuery,
    @CurrentUser() user: AuthUser,
  ) {
    return this.content.list(user.tenantId, siteId, q);
  }

  @Post()
  @HttpCode(201)
  create(
    @Param('siteId', new ParseUUIDPipe()) siteId: string,
    @Body() dto: CreateContentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.content.create(user.tenantId, siteId, user.userId, dto);
  }
}
