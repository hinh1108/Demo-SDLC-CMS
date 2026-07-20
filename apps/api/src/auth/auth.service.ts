import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DbService } from '../db/db.service';
import { config } from '../config';
import { Unauthorized } from '../common/problem';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');
  constructor(private db: DbService) {}

  async login(email: string, password: string, ip: string) {
    const user = await this.db.authLookup(email);

    // Thông báo CHUNG cho mọi nhánh thất bại → chống user enumeration (AC2)
    if (!user || user.status !== 'active') {
      this.logger.warn(`login FAIL (no/inactive user) email=${email} ip=${ip}`);
      throw Unauthorized('Email hoặc mật khẩu không đúng.');
    }
    const ok =
      !!user.password_hash && (await bcrypt.compare(password, user.password_hash));
    if (!ok) {
      this.logger.warn(`login FAIL (bad password) email=${email} ip=${ip}`);
      throw Unauthorized('Email hoặc mật khẩu không đúng.');
    }

    this.logger.log(`login OK user=${user.id} tenant=${user.tenant_id} ip=${ip}`);
    const access_token = jwt.sign(
      { sub: user.id, tenant_id: user.tenant_id, role: user.role_name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
    );
    return { access_token, token_type: 'Bearer', expires_in: 900 };
  }
}
