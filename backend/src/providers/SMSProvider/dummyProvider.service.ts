import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class DummyProvider {
  constructor(private readonly prismaService: PrismaService) {}
  async sendSmsCode(email: string, role: Role) {
    // const response = await this.prismaService.inviteCodes.create({
    //   data: {
    //     email: email,
    //     role: role,
    //   },
    // });
    return 'sent SMS confirmation';
  }
}
