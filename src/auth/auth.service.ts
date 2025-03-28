import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<Partial<User>> {
    await this.userService.create(registerDto);
    const user = await this.userService.findByUsername(registerDto.username);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; username: string; role: string }> {
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);

    if (user && await bcrypt.compare(password + user.salt, user.password)) {
      const payload = { username: user.username, sub: user.id, role: user.role };
      return {
        accessToken: this.jwtService.sign(payload),
        username: user.username,
        role: user.role,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}