import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/requests/login.request.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/responses/login.response.dto';
import { RegisterRequestDto } from '../user/dto/requests/register-user.request.dto';
import { RegisterResponseDto } from '../user/dto/responses/register.response.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  async register(registerUserDto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const createdUser = await this.userService.register(registerUserDto);

    const token = this.generateToken(createdUser.id);

    return { user: createdUser, token };
  }

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.userService.search({ email: loginDto.email });
    const user = response.users[0];

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.comparePassword(user.id, loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.generateToken(user.id),
      user,
    };
  }

  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
}
}
