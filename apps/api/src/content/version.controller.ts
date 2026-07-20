import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ContentService } from './content.service';

@Controller('versions')
@UseGuards(JwtGuard)
export class VersionController {
  constructor(private content: ContentService) {}

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.content.getVersion(u.tenantId, id);
  }
}
