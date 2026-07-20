import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** Chuẩn hoá mọi lỗi thành application/problem+json (RFC 7807). */
@Catch()
export class ProblemFilter implements ExceptionFilter {
  private logger = new Logger('Http');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<any>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any = {
      type: 'https://api.vietcms.vn/errors/internal-error',
      title: 'Internal Server Error',
      status,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse() as any;
      if (r && typeof r === 'object' && r.type && r.title) {
        body = { ...r, status }; // đã là problem (do helper tạo)
      } else {
        const msg = typeof r === 'string' ? r : r?.message ?? exception.message;
        body = {
          type: 'https://api.vietcms.vn/errors/' + (status === 400 ? 'validation-error' : 'error'),
          title: HttpStatus[status] ?? 'Error',
          status,
          detail: Array.isArray(msg) ? msg.join('; ') : msg,
        };
      }
    } else {
      // Lỗi ngoài dự kiến — KHÔNG lộ stack/chi tiết ra client, chỉ log nội bộ
      this.logger.error((exception as any)?.message, (exception as any)?.stack);
    }

    body.instance = req.url;
    res.status(status).type('application/problem+json').send(body);
  }
}
