import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtPassport } from './jwtPassport';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
      PassportModule,
      UserModule,
      JwtModule.register({
          secret: process.env.JWTKEY,
          signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
      }),
  ],
  providers: [
    AuthService,
    JwtPassport
  ],
  controllers: [AuthController]
})
export class AuthModule {}
