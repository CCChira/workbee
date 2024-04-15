import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from './guard/role.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';

export const AuthDecorators = (roles: Role[]) =>
  applyDecorators(UseGuards(RolesGuard, JwtAuthGuard), Roles(...roles));
