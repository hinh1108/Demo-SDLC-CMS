import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { SLUG_RE } from './create-content.dto';

export class UpdateContentDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200)
  title?: string;

  @IsOptional() @IsString() @MaxLength(200) @Matches(SLUG_RE, { message: 'slug chỉ gồm chữ thường, số và dấu nối' })
  slug?: string;
}
