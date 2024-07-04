import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export default class AccessStrategy extends PassportStrategy(Strategy, 'heoga') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access_test',
    });
  }

  //인증
  validate(payload) {
    console.log(payload);
    return {
      id: payload.sub,
    };
  }
}
