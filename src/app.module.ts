import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './providers/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WebsocketsModule } from './websockets/websockets.module';
import { S3ConfigService } from './config/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 6000,
      limit: 100,
    }]),
    DatabaseModule,
    UserModule,
    AuthModule,
    WebsocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }, S3ConfigService],
  exports: [S3ConfigService],
})
export class AppModule { }
