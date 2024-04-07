import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'zjP9h6ZI5LoSKCRj',
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.usersService.findUser(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
