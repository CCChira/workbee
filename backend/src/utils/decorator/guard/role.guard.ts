import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log(context.switchToHttp().getRequest().headers.authorization);
    const decodedRole = this.jwtService.decode(
      context.switchToHttp().getRequest().headers.authorization.split(' ')[1],
    ).role;
    if (!requiredRoles) return true;
    return requiredRoles.some((role) => decodedRole?.includes(role));
  }
}
