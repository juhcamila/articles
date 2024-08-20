import { Injectable, NestMiddleware, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) { }

  async use(req: Request, _res: Response, next: NextFunction) {
    const method = req.method;
    const path = req.path;
    const token = this.extractTokenFromHeader(req);

    try {
      if (token) {
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.HASH_SECRET_TOKEN,
        });

        this.logger.log(`[${new Date().toISOString()}] ${method} ${path} - User ID: ${user?.id}`);
        req['user'] = user
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    next()
  }

  extractTokenFromHeader = (request: Request): string | undefined => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}