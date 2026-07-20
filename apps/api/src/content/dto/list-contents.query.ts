import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContentStatus {
  draft = 'draft', review = 'review', approved = 'approved',
  scheduled = 'scheduled', published = 'published', archived = 'archived',
}

export enum ContentKind { page = 'page', post = 'post' }

export class ListContentsQuery {
  @IsOptional() @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 20;

  @IsOptional() @IsString()
  cursor?: string; // ISO updated_at (keyset)
}
