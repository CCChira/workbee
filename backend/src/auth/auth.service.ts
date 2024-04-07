import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email?: string, password?: string): Promise<AuthEntity> {
    console.log(email, password);
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ id: user.id, role: user.role }),
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  // async authenticateEmployee(loginCode: string): Promise<AuthEntity> {
  //   const employee = await this.prisma.user.findUnique({
  //     where: {
  //       loginCode: loginCode,
  //     },
  //   });
  //
  //   if (!employee) {
  //     throw new NotFoundException(`No employee found for code: ${code}`);
  //   }
  //
  //   return {
  //     accessToken: this.jwtService.sign({ userId: employee.id }),
  //     id: employee.id,
  //     email: employee.email,
  //     role: employee.role,
  //   };
  // }
}
