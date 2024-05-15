import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
      ]),
      secretOrKey: 'zjP9h6ZI5LoSKCRj',
    });
  }
  private static extractJwtFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }
  async validate(payload: { id: string }) {
    const user = await this.usersService.findUser(payload.id);
    console.log(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
