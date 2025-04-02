// src/common/middlewares/auth-user.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;
    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }
    try {
      const decoded = verify(token, 'SECRET_KEY');      
      const { userId } = decoded as { userId?: number };
      if (!userId) {
        throw new UnauthorizedException('Token invalid: no userId');
      }
      (req as any).user = { id: userId };
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
