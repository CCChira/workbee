import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createAccessToken(userId: string, role: Role) {
    console.log(
      await this.jwtService.sign({ id: userId, role }, { expiresIn: '1h' }),
    );
    return this.jwtService.sign({ id: userId, role }, { expiresIn: '1h' });
  }
  async createRefreshToken(userId: string, role: Role) {
    const token = uuidv4();
    return this.jwtService.sign(
      { id: userId, tokenId: token, role: role },
      { expiresIn: '7d' },
    );
  }
  async validateToken(token: string) {
    const { id } = this.jwtService.decode(token);
    return this.prisma.user.findUnique({ where: { id } });
  }
  async login(email?: string, password?: string): Promise<AuthEntity> {
    console.log(email, password);
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (!user) {
      throw new NotFoundException({
        message: `Invalid email or password`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        status: HttpStatus.FORBIDDEN,
      });
    }
    const accessToken = await this.createAccessToken(user.id, user.role);
    const refreshToken = await this.createRefreshToken(user.id, user.role);
    return {
      accessToken,
      refreshToken,
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
