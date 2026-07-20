import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentItemController } from './content-item.controller';
import { VersionController } from './version.controller';
import { ContentService } from './content.service';

@Module({
  controllers: [ContentController, ContentItemController, VersionController],
  providers: [ContentService],
})
export class ContentModule {}
