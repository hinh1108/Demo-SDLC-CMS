import {
  Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/update-content.dto';
import { SaveVersionDto } from './dto/save-version.dto';

@Controller('contents/:id')
@UseGuards(JwtGuard)
export class ContentItemController {
  constructor(private content: ContentService) {}

  @Get()
  get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.content.get(u.tenantId, id);
  }

  @Patch()
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateContentDto,
    @CurrentUser() u: AuthUser,
  ) {
    return this.content.update(u.tenantId, id, dto);
  }

  @Post('versions')
  @HttpCode(201)
  saveVersion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveVersionDto,
    @CurrentUser() u: AuthUser,
  ) {
    return this.content.saveVersion(u.tenantId, id, u.userId, dto.blocks);
  }

  @Get('versions')
  listVersions(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.content.listVersions(u.tenantId, id);
  }
}
