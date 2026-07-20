import { IsISO8601, IsOptional } from 'class-validator';

export class PublishDto {
  // Bỏ trống = xuất bản ngay; có = lên lịch (không được ở quá khứ — kiểm ở service)
  @IsOptional() @IsISO8601()
  scheduled_at?: string;
}
