import { DatabaseModule } from './../database/database.module';
import { AuthRepository } from './repository/auth.repository';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from './../config';

@Module({
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
    DatabaseModule,
  ],
})
export class AuthModule {}
