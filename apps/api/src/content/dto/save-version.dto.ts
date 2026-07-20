import { IsArray } from 'class-validator';

export class SaveVersionDto {
  // Cấu trúc block validate sâu ở service (blocks.util.validateBlocks)
  @IsArray()
  blocks!: unknown[];
}
