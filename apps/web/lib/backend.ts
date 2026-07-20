// URL API nội bộ (server-side). Trong compose: http://api:3001/v1
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/v1';

export function roleFromToken(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
    return payload.role || '';
  } catch {
    return '';
  }
}
