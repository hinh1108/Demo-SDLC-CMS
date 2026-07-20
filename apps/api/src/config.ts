import * as fs from 'fs';
import * as path from 'path';

// Nạp .env đơn giản (không cần dependency dotenv) nếu file tồn tại.
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl:
    process.env.DATABASE_URL || 'postgres://app_login:app_pw@localhost:55432/vietcms',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  // Rate-limit đăng nhập: số lần / 60s / IP. Prod nên để thấp (10); dev/e2e nới rộng.
  loginRateMax: parseInt(process.env.LOGIN_RATE_MAX || '10', 10),
};
