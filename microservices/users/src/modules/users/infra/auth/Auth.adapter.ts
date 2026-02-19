import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/User.js';
import {
  IAuthService,
  type TokenResult,
} from '../../domain/services/IAuthService.js';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthAdapter implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): TokenResult {
    const payload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { access_token };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
