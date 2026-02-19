import { UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repository/IUserRepository.js';
import { IAuthService } from '../../domain/services/IAuthService.js';
import type { AuthResult, UserResponse } from './RegisterUser.js';

export interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await this.authService.comparePassword(
      input.password,
      user.passwordHash,
    );
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { access_token } = this.authService.generateToken(user);

    const userResponse: UserResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return {
      user: userResponse,
      access_token,
    };
  }
}
