import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { HealthModule } from './health/health.module';

@Module({ imports: [DbModule, AuthModule, ContentModule, HealthModule] })
export class AppModule {}
