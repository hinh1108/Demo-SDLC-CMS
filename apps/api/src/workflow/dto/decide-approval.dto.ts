import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ApprovalResult { approved = 'approved', rejected = 'rejected' }

export class DecideApprovalDto {
  @IsEnum(ApprovalResult)
  result!: ApprovalResult;

  @IsOptional() @IsString() @MaxLength(2000)
  note?: string; // bắt buộc khi từ chối (kiểm ở service)
}
