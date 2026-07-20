import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { HealthModule } from './health/health.module';
import { WorkflowModule } from './workflow/workflow.module';
import { PublishingModule } from './publishing/publishing.module';

@Module({ imports: [DbModule, AuthModule, ContentModule, HealthModule, WorkflowModule, PublishingModule] })
export class AppModule {}
