import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (!context.switchToHttp().getRequest().url.includes('getUserChat')) {
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
      const decoded = this.jwtService.decode(
        context.switchToHttp().getRequest().cookies['access_token'],
      );
      if (decoded) {
        const decodedRole = decoded.role;
        if (!requiredRoles) return true;
        return requiredRoles.some((role) => decodedRole?.includes(role));
      } else throw new UnauthorizedException(401, 'Unauthorized');
    } else return true;
  }
}
