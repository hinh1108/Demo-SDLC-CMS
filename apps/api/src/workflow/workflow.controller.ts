import {
  Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query, UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { WorkflowService } from './workflow.service';
import { DecideApprovalDto } from './dto/decide-approval.dto';

@Controller()
@UseGuards(JwtGuard) // mọi route yêu cầu đăng nhập
export class WorkflowController {
  constructor(private wf: WorkflowService) {}

  // US-05 — gửi duyệt
  @Post('contents/:id/submission')
  @HttpCode(200)
  submit(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.wf.submit(u.tenantId, id, u.userId);
  }

  // US-06 — hàng chờ duyệt của tôi
  @Get('approvals')
  queue(@CurrentUser() u: AuthUser) {
    return this.wf.queue(u.tenantId);
  }

  // US-06 — duyệt/từ chối (RBAC: chỉ manager/admin)
  @Post('contents/:id/approvals')
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles('manager', 'admin')
  decide(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: DecideApprovalDto,
    @CurrentUser() u: AuthUser,
  ) {
    return this.wf.decide(u.tenantId, id, u.userId, dto);
  }

  // US-06 — lịch sử duyệt
  @Get('contents/:id/approvals')
  history(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() u: AuthUser) {
    return this.wf.history(u.tenantId, id);
  }
}
