import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../infra/auth/jwt-auth.guard.js';
import { JwtPayload } from '../infra/auth/jwt.strategy.js';
import { IUserRepository } from '../domain/repository/IUserRepository.js';
import { RegisterUser } from '../application/use-cases/RegisterUser.js';
import { LoginUser } from '../application/use-cases/LoginUser.js';
import { LoginUserDto, RegisterUserDto } from './dtos/user.dto.js';

@Controller()
export class UsersController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  @Post('users')
  async register(@Body() body: RegisterUserDto) {
    return this.registerUser.execute({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });
  }

  @Post('auth')
  async login(@Body() body: LoginUserDto) {
    return this.loginUser.execute({
      email: body.email,
      password: body.password,
    });
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request & { user?: JwtPayload }) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
