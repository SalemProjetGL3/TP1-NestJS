import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.role === 'admin') {
      return true;  
    }else{
      throw new ForbiddenException('Accès refusé, administrateur requis');  
    }
  }
}
