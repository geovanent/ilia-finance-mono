import { ConflictException, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repository/IUserRepository.js';
import { IAuthService } from '../../domain/services/IAuthService.js';

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResult {
  user: UserResponse;
  access_token: string;
}

export class RegisterUser {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IAuthService) private readonly authService: IAuthService,
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.authService.hashPassword(input.password);
    const user = User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
    });

    await this.userRepository.save(user);
    const { access_token } = this.authService.generateToken(user);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      access_token,
    };
  }
}
