import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserEntity } from './entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { decrypt, encrypt } from './../../config/utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository)
    private readonly authRepository: AuthRepository,
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<UserEntity> {
    const userByUsername = await this.authRepository.findByUsername(createAuthDto.username)

    if (userByUsername) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const password = encrypt(createAuthDto.password)
    createAuthDto.password = JSON.stringify(password)
    return await this.authRepository.create(createAuthDto)
  }

  async login(credentials: LoginDto): Promise<{ token: string }> {
    const userByUsername = await this.authRepository.findByUsername(credentials.username)

    if (!userByUsername) {
      throw new HttpException('Credentials invalids!', HttpStatus.UNAUTHORIZED);
    }

    const {encryptedData, iv, authTag } = JSON.parse(userByUsername.password)
    const password = decrypt(encryptedData, iv, authTag)
    
    if (credentials.password !== password) {
      throw new HttpException('Credentials invalids!', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: userByUsername.username, id: userByUsername.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
