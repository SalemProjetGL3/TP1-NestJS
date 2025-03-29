import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadInterface } from './interfaces/payload.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { omit } from 'lodash';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '123INSATGL3', // In production, use environment variable
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.userRepository.findOneBy({ username: payload.username });
    if(user){
      return omit(user, ['password', 'salt']);  // Return the user object without password
    } else {
      throw new UnauthorizedException('Unauthorized user');
    }
  }
}