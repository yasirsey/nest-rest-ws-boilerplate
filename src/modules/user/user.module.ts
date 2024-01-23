import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { S3ConfigService } from 'src/config/s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ConfigModule],
  providers: [UserService, AuthService, S3ConfigService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
