import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class PutSeoDto {
  @IsOptional() @IsString() @MaxLength(200)
  title?: string;

  @IsOptional() @IsString() @MaxLength(320)
  description?: string;

  @IsOptional() @IsString() @MaxLength(500)
  keywords?: string;

  @IsOptional() @IsObject()
  schema_json?: Record<string, unknown>;
}
