import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ContentKind } from './list-contents.query';

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateContentDto {
  @IsEnum(ContentKind)
  kind!: ContentKind;

  @IsString() @MinLength(1) @MaxLength(200)
  title!: string;

  @IsOptional() @IsString() @MaxLength(200) @Matches(SLUG_RE, { message: 'slug chỉ gồm chữ thường, số và dấu nối' })
  slug?: string;
}
