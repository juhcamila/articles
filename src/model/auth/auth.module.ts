import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.HASH_SECRET_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    AuthController,
    AuthRepository
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
