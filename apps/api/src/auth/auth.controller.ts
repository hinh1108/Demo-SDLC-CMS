import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginThrottleGuard } from './login-throttle.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(200) // login không tạo resource → 200, không phải 201 (khớp OpenAPI)
  @UseGuards(LoginThrottleGuard)
  login(@Body() dto: LoginDto, @Req() req: any) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    return this.auth.login(dto.email, dto.password, ip);
  }
}
