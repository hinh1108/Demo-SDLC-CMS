import { HttpException } from '@nestjs/common';

const BASE = 'https://api.vietcms.vn/errors/';

/** Tạo HttpException mang body RFC 7807. */
export function problem(
  status: number,
  type: string,
  title: string,
  detail?: string,
  errors?: Array<{ field: string; message: string }>,
) {
  return new HttpException(
    { type: BASE + type, title, status, ...(detail ? { detail } : {}), ...(errors ? { errors } : {}) },
    status,
  );
}

export const Unauthorized = (detail?: string) =>
  problem(401, 'unauthorized', 'Unauthorized', detail);
export const Forbidden = (detail?: string) =>
  problem(403, 'forbidden', 'Forbidden', detail);
export const BadRequest = (detail?: string) =>
  problem(400, 'validation-error', 'Validation Error', detail);
