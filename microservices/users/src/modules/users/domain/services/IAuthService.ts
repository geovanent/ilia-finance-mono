import { User } from '../entities/User.js';

export interface TokenResult {
  access_token: string;
}

export abstract class IAuthService {
  abstract generateToken(user: User): TokenResult;

  abstract hashPassword(password: string): Promise<string>;

  abstract comparePassword(password: string, hash: string): Promise<boolean>;
}
